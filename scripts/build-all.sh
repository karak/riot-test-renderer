#!/usr/bin/sh

run_build() {
  pushd "$1"
  npm run build
  popd
}

run_build "packages/riot-test-renderer-shared"
run_build "packages/riot-test-utils"
run_build "packages/riot-enzyme"
