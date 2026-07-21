# PR #26 コードレビュー — `fix: resolve npm audit vulnerabilities and migrate to npm workspaces`

- 対象: https://github.com/karak/riot-test-renderer/pull/26
- head: `claude/npm-audit-vulnerability-fix-cvrz4n` (`9f823e7`) / base: `master` (`b44ca88`)
- 規模: 43 files（実質的な変更は約15ファイル、残りは lockfile の入れ替え）

## 総合判定: **Approve**

十分にスコープが絞られた、正直で、完全に再現検証済みのメンテナンス PR。説明文の主張はすべて手元でそのまま再現でき、確認したコード変更はいずれも「実際のコンパイラ/フレームワーク挙動の変化への正当な対応」であり、リグレッションを覆い隠すものではない。

## 変更内容

長期間放置されていたリポジトリのツールチェーンを近代化し、audit 指摘をゼロにする。

- **セキュリティ:** 122 件（critical 32 件）→ **0 件**。直接依存のバージョンアップに加え、残存する推移的依存に対する的を絞った `overrides` で解消。
- **ビルド系:** `lerna bootstrap`（現行 lerna で廃止）をやめ、ネイティブの **npm workspaces** + lerna 9 へ移行。パッケージ個別の lockfile をルート1本に集約。
- **ツールチェーンの大幅更新:** jest 22→30, ts-jest 22→29, **TypeScript 2.8→5.9**, rollup 0.58→4（`@rollup/plugin-*` へのリネーム込み）。
- **派生的な修正:** 厳格化したコンパイラが検出した TS エラー、および実際の（正しい）フレームワーク挙動に合わせたテスト期待値の修正。

## 検証（`9f823e7` のクリーンチェックアウトで再現）

| 主張 | 結果 |
|---|---|
| クリーンインストール | ✅ `npm ci` exit 0、lockfile 無変更、peer-dep 競合なし |
| `npm audit` = 0 | ✅ critical/high/moderate/low/info すべて **0** |
| 全4パッケージのビルド | ✅ クリーン（既存の無害な警告のみ） |
| 41 suites / 248 tests | ✅ **完全一致**、失敗 0 |

## 良い点

- **ランタイムの `riot` を意図的に上げていない**（3.x のまま）。変更はすべてツール側で、ライブラリ自体の挙動は据え置き。バージョンジャンプのリスクを大きく下げる正しい判断。
- **`overrides` のスコープが適切。** 6 つの対象（`cheerio`, `js-yaml`, `tar`, `axios`, `brace-expansion`, `riot-cli` 配下の `chokidar`/`rollup`）はいずれも *純粋に推移的* な依存で、直接依存には一つも存在しない。ピン留めは的確な外科的修正であり、直接 devDependency の `rollup` とも衝突しない。
- **テスト期待値の変更は本物で、辻褄合わせではない**（各クラスを検証済み）:
  - `opts()` の `dataIs: 'tag'` → riot 自身がマウント時にルートの `data-is` 属性をキャメルケース化して `opts` に注入している（`riot+compiler.js:1833`）。`opts` getter は無変更。テストが *以前から間違っていた*。
  - `'blue'` → `'rgb(0, 0, 255)'` → jsdom の CSSOM による色の正規化。
  - スナップショットの `Array [ … ]` → `[ … ]` → jest 30 の `pretty-format` の変更。
  - `toThrowError()` → `toThrow()`, `MockInstance<void>` → `Mock` → jest 30 の API/型更新。
- **正直な開示。** riot-enzyme のテストが *一度も実行されていなかった*（既存の prettier lint 失敗が `pretest` を短絡させていた）ことを明記。これらのスイートが実際に走るようになったのはカバレッジの実質的改善。
- 追加された `!` 非 null アサーション（`children.item(i)!`, `element!`）は、ループ不変条件 / jest ライフサイクル順序から見ていずれも安全。

## 指摘・改善提案（いずれも blocking ではない）

1. **単一の巨大コミットに5つの関心事が混在（43 files）。** セキュリティ + workspace 移行 + ツールチェーン更新 + TS 修正 + テスト修正が1コミット。将来リグレッションが出た際に `git bisect` / 部分 revert が難しくなる。今から分割し直す価値はないが、今後の大規模一括変更では意識したい点。
2. **`packages/jquery/src/index.ts` の冗長なキャスト。** `(isSetter as Function)` のキャストは新たに有効化された `strictBindCallApply` を満たすために *必要*（`isSetter` の `this: JQuery` と外側の `RiotWrapper|WeakWrapper` コンテキストの不一致）で、かつ安全（どちらの `isSetter` 実装も `this` を参照しない）。一方 `(($el as any)[name] as Function)` のキャストは既に `any` 型の値に対するものなので `as Function` は不要。無害だが `($el as any)[name].apply($el, arguments)` の方が読みやすい。
3. **テストでの型安全性の後退** — `(Simulate as any)[type]`, `(obj as any)[key]`, `const rendered: any`。厳格化 TS に対するテスト/グルーコードでの妥当なエスケープハッチだが、型チェックを黙らせている点は留意。放置で可。
4. **`cheerio` を RC 版 `1.0.0-rc.12` に固定。** 推移的 override として機能するが、リリース候補への固定は長期的にはやや脆い。依存チェーンが許すようになったら安定版 `cheerio` 1.x への移行をフォローアップに。
5. **`brace-expansion ^5` / `tar ^7`** はビルドツール系推移的依存へのメジャーバージョン override。green なビルド/テストでカバーされているが、将来 lockfile 再生成時にインストール段階で静かに壊れうる点だけ注意。

## リスク評価

低。ランタイム/プロダクションのロジック変更は無し（変更はすべて型・テスト期待値・設定・依存）。ランタイム `riot` 据え置き、全スイート green、audit クリーン、`mergeable_state: clean`。マージ可能。

---

## 検証手法（付録）

低難易度の機械的タスクは Sonnet サブエージェントへ、事前に受入条件と成果物を定義した上で委譲した。

- **検証エージェント:** クリーンチェックアウト上で install / audit / build / test を再現し、PR の主張値との一致を必須項目として報告。→ すべて一致（`npm ci` exit 0、audit 全 severity 0、4 パッケージ build 成功、41 suites / 248 tests・失敗 0、HEAD sha 一致、tracked file 無変更）。
- **ソース精査エージェント:** `dataIs` 挙動の出所、`as Function` キャスト、`!` アサーション、`TagOpts` ジェネリック制約、override 対象が直接/推移的かの5点を `file:line` 付きで回答。→ 上記「良い点」に反映。
