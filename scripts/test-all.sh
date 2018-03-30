#!/usr/bin/sh

run_test() {
  pushd "$1"
  npm test
  popd
}

run_test "packages/riot-test-utils"
run_test "packages/riot-enzyme"
run_test "packages/riot-enzyme-examples"
