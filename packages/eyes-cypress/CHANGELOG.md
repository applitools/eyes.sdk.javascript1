# Changelog

## Unreleased


 ## 3.10.3 - 2020/4/30

- updated to @applitools/dom-snapshot@3.5.0 
- updated to @applitools/visual-grid-client@13.7.3

## 3.10.2 - 2020/4/27

- add edgechromium to types
- updated to @applitools/visual-grid-client@13.7.2

## 3.10.1 - 2020/4/27

- add edgechromium to readme

## 3.10.0 - 2020/4/26

- support edgelegacy, edgechromium, and edgechromium-one-version-back
- updated to @applitools/dom-snapshot@3.4.5
- updated to @applitools/eyes-sdk-core@9.2.1
- updated to @applitools/visual-grid-client@13.7.1

## 3.9.21 - 2020/3/31

- removed eyes-common dependency

## 3.9.20

- avoid unnecessary requests to get batchInfo (due to wrong `isGeneratedId` value on batchInfo)

## 3.9.19

- update @applitools/dom-snapshot@3.4.1 to fix missing css-tree dependency issue

## 3.9.18

- update @applitools/dom-snapshot@3.4.0 to get correct css in DOM snapshots ([Trello](https://trello.com/c/3BFtM4hx/188-hidden-spinners-in-text-field-are-visible-in-firefox), [Trello](https://trello.com/c/S4XT7ONp/192-vg-dom-snapshot-deletes-duplicate-keys-from-css-rules), [Trello](https://trello.com/c/mz8CKKB7/173-selector-not-seen-as-it-should-be-issue-with-css-variable), [Trello](https://trello.com/c/KZ25vktg/245-edge-screenshot-different-from-chrome-and-ff))

## 3.9.17

- Typescript type defs: mark `cy.eyesCheckWindow` arguments as optional

## 3.9.16

- Support both new and old server versions for identifying new running sessions. ([Trello](https://trello.com/c/mtSiheZ9/267-support-startsession-as-long-running-task))

## 3.9.15

- add missing browsers to TypeScript definitions [Trello](https://trello.com/c/2QEofssH/264-cypress-js-vs-ts-not-the-same-goodrx-poc)

## 3.9.14

- fix trying to fetch branch info from server on non github integration runs
- support future long running tasks [Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks)


v3.9.11 / 2020-02-16
====================

* 3.9.11 [[ef8f5f8](https://github.com/applitools/eyes-cypress/commit/ef8f5f880f02ab63c422b246270f34742f0e4ecc)]
* updated vgc to support branching feature [[78c6ca5](https://github.com/applitools/eyes-cypress/commit/78c6ca58da6eaf723964276c98cf3802e06f79c0)]
* changelog [[87f36ce](https://github.com/applitools/eyes-cypress/commit/87f36ce69e1f9e8b2b7fcc44d83b3d36dafd34a7)]

v3.9.10 / 2020-02-11
====================

* 3.9.10 [[e1a1584](https://github.com/applitools/eyes-cypress/commit/e1a15844aa673774a841015cc6725e9054f47f03)]
* updated vgc to handle empty resources [[04e164f](https://github.com/applitools/eyes-cypress/commit/04e164f5794f90a0a427eba3e69a0b1fab65c671)]
* 3.9.9 [[8560715](https://github.com/applitools/eyes-cypress/commit/85607157f13f488606902df99605828d3fbbf52e)]
* update vgc and esc to send stitching server to vg [[6ed8a32](https://github.com/applitools/eyes-cypress/commit/6ed8a3263181fb33a3fcd1219ec271f8978c1d69)]

v3.9.9 / 2020-02-11
===================

* 3.9.9 [[c52aff7](https://github.com/applitools/eyes-cypress/commit/c52aff778d875a9b0d9b106bace11d03684a5ebc)]
* updated vgc to handle empty resources [[9cf0c0e](https://github.com/applitools/eyes-cypress/commit/9cf0c0e1b947d9d72129020f4e0689cc295bad00)]
* changelog [[ae96c32](https://github.com/applitools/eyes-cypress/commit/ae96c32b6af6fba6a0f8f67ffb548c2b9c35252c)]

v3.9.8 / 2020-02-04
===================

* 3.9.8 [[c223e8f](https://github.com/applitools/eyes-cypress/commit/c223e8f26211fac9533c5e075027b91c3b929ac3)]
* updated vgc to 13.5.11 for better RGridResource logging [[3c07a86](https://github.com/applitools/eyes-cypress/commit/3c07a8624dbf6aa0776ddc036a041243ca14d784)]
* 3.9.7 [[39628ac](https://github.com/applitools/eyes-cypress/commit/39628ac506287c6a004bb10969b925b45083909b)]
* update deps to fix emulationInfo validation [[ad3597c](https://github.com/applitools/eyes-cypress/commit/ad3597c5271554734c9ede276226fb731a42b957)]
* 3.9.6 [[676ab54](https://github.com/applitools/eyes-cypress/commit/676ab548607dba9e5df95b7e490a3f58a6846020)]
* update packages to get dom-snapshot fix [[e8d830c](https://github.com/applitools/eyes-cypress/commit/e8d830c1b6a3e7712daef71815554ab60d8cbca3)]
* 3.9.5 [[e0d7a6c](https://github.com/applitools/eyes-cypress/commit/e0d7a6cf6ccafca5a5c9cf051f09eb8fd533592c)]
* docs for multi-version browsers and safari [[27b1181](https://github.com/applitools/eyes-cypress/commit/27b11810598aa94614627f6a8b118afe8ee4f0b5)]
* 3.9.4 [[5d1e0a9](https://github.com/applitools/eyes-cypress/commit/5d1e0a9b736eef7b27dc4aea93c43a7d21faf664)]
* fix exception in sendRequest while putting resources [[16465a2](https://github.com/applitools/eyes-cypress/commit/16465a2e6b9bfb50264d09736b5ce83c838e028c)]
* 3.9.3 [[6277a60](https://github.com/applitools/eyes-cypress/commit/6277a60add4956e9331a6120e2e8d7a16147148e)]
* update packages to get ua even in case of render failure [[c5ee4f5](https://github.com/applitools/eyes-cypress/commit/c5ee4f58ff8eab7be19bd9be442f7ae54938fe02)]
* Merge pull request #28 from TroyTae/master [[0649ab1](https://github.com/applitools/eyes-cypress/commit/0649ab1801a84bd559b97a1639fb2bb2c2572998)]
* fix: typo [[f1a1a14](https://github.com/applitools/eyes-cypress/commit/f1a1a14e1fe55bcf646caa2ae9a16ab928926b7c)]
* license [[1bc469d](https://github.com/applitools/eyes-cypress/commit/1bc469dede16936c5bae810632e1f32c8e14551a)]

v3.9.3 / 2020-02-04
===================

* 3.9.3 [[f41ed61](https://github.com/applitools/eyes-cypress/commit/f41ed61faaf89a573310a741ae84fdecff3afcca)]
* updated vgc to 3.5.11 for better RGridresource loggin [[69822c4](https://github.com/applitools/eyes-cypress/commit/69822c4bcf4de4eee4bba6e8bde2b18bf22dbb61)]
* changelog [[84ca430](https://github.com/applitools/eyes-cypress/commit/84ca4304f74c98b683584978062f4c12180803fc)]

v3.9.2 / 2019-12-15
===================

* 3.9.2 [[e47badb](https://github.com/applitools/eyes-cypress/commit/e47badbb9511f389c2c7719fa735eb3002004cae)]

v3.9.1 / 2019-12-15
===================

* 3.9.1 [[c4a097f](https://github.com/applitools/eyes-cypress/commit/c4a097f0d06ef71b23735f73a45e18db258849f1)]
* changelog [[ffbb132](https://github.com/applitools/eyes-cypress/commit/ffbb132f2969860c349cc1a5e77d7f939940704b)]
* updated vgc to support isHttpOnly flag [[4ae4593](https://github.com/applitools/eyes-cypress/commit/4ae4593b3088fb5db0c55f61180744de3556327d)]
* 3.9.0 [[5ad6aa9](https://github.com/applitools/eyes-cypress/commit/5ad6aa93c55c229ab63551a41d34a5402ad35963)]
* bump vgc to 13.4.0 to get multi browser version support [[b226cec](https://github.com/applitools/eyes-cypress/commit/b226cecaadbc9aba47deaf84ac254f927f8af0f3)]
* Fixes a spelling mistake during eyes-setup [[4ab4adf](https://github.com/applitools/eyes-cypress/commit/4ab4adfba9782902ef11bb560f5dc8f4ff11fd4a)]

v3.8.22 / 2019-12-15
====================

* 3.8.22 [[5ba4cf3](https://github.com/applitools/eyes-cypress/commit/5ba4cf38e329502c838e6c19054532c20bd75aba)]
* updated vgc to support isHttpOnly flag [[68d5077](https://github.com/applitools/eyes-cypress/commit/68d507776ddaa40413ce0027dd18520c95086c44)]
* fixed proxy readme stuff [[f90b959](https://github.com/applitools/eyes-cypress/commit/f90b959fa6823fe2375abe031b0b56a1f93cce5d)]
* changelog [[0c46736](https://github.com/applitools/eyes-cypress/commit/0c46736e0a160a815ed0059704ad95da6446b0b6)]

v3.8.21 / 2019-11-26
====================

* 3.8.21 [[c1cc9ef](https://github.com/applitools/eyes-cypress/commit/c1cc9ef87370b06122dd82d06cbb4a74a4c9fe6f)]
* updated vgc to have use applitools jsdom (no canvas dependency) [[06b2c26](https://github.com/applitools/eyes-cypress/commit/06b2c26bf68663d1bc943e70c8f5a7e9e66b8c1d)]
* removed accessibility from readme [[77a8585](https://github.com/applitools/eyes-cypress/commit/77a85851da18316d1de6569db5ab9b6f1433d63c)]
* play changes [[2fd2626](https://github.com/applitools/eyes-cypress/commit/2fd262633c1d17d20db60f3fb40bfd08cd7c61cb)]
* changelog [[788aacb](https://github.com/applitools/eyes-cypress/commit/788aacba8a80d44b2015ee83366169394d7ee339)]

v3.8.20 / 2019-11-17
====================

* 3.8.20 [[8bc2eaf](https://github.com/applitools/eyes-cypress/commit/8bc2eaf06edb211521ec1c1e803712e13f79d572)]
* updated vgc to support bamboo prefix [[0057a48](https://github.com/applitools/eyes-cypress/commit/0057a485b8c402cabf8b05ed013b1f579625e254)]
* styling for index table [[799bf30](https://github.com/applitools/eyes-cypress/commit/799bf30993477181963e518325253c197ff507dc)]
* trying index table fix 7 [[decd779](https://github.com/applitools/eyes-cypress/commit/decd779aa5c292b35a301148cc43fd2b757b7d79)]
* trying index table fix 6 [[2d46882](https://github.com/applitools/eyes-cypress/commit/2d468828a3de0bbddfcddee76dd804f2c0d3928c)]
* trying index table fix 5 [[51aaf6e](https://github.com/applitools/eyes-cypress/commit/51aaf6eb19268d41059c24c1d434a592d7c49f8b)]
* trying index table fix 4 [[ea6ea31](https://github.com/applitools/eyes-cypress/commit/ea6ea31218366e29670ba9d902d98449d9ccde7c)]
* trying index table fix 3 [[f0e7cc8](https://github.com/applitools/eyes-cypress/commit/f0e7cc89cc46b7fd1432ba7b7e651947ea4ad257)]
* trying index table fix 2 [[87421f3](https://github.com/applitools/eyes-cypress/commit/87421f3d2caa2c5d50513984ba614621a4eea953)]
* trying index table fix [[4813abf](https://github.com/applitools/eyes-cypress/commit/4813abfe8be9a6c1db865123d5788e9d2bb4c4ca)]
* added index table to readmne [[ca29a9e](https://github.com/applitools/eyes-cypress/commit/ca29a9e6c0f4741fb55084d22a146977c64189da)]
* enabled accessibility readme [[6722d2a](https://github.com/applitools/eyes-cypress/commit/6722d2a2b517d687f52efa70ddf08d10c796f416)]
* changelog [[9fb4b53](https://github.com/applitools/eyes-cypress/commit/9fb4b53757e41f3cbce51d6896726911b7c57b3e)]

v3.8.19 / 2019-11-14
====================

* 3.8.19 [[7dce6c3](https://github.com/applitools/eyes-cypress/commit/7dce6c3773cc76c0c89d3bcf4501aae07e3273b2)]
* updated vgc [[35c2fd4](https://github.com/applitools/eyes-cypress/commit/35c2fd4130eeb43fa27b415a6b0fb5d6b1c9243a)]
* better setup process and typescript file path search. [[fee891a](https://github.com/applitools/eyes-cypress/commit/fee891a8bae53409d505f6411c296a059621af37)]
* changelog [[d942cdd](https://github.com/applitools/eyes-cypress/commit/d942cdd921a36a539f81d9af35424b2765d0f691)]

v3.8.18 / 2019-11-05
====================

* 3.8.18 [[4524ecc](https://github.com/applitools/eyes-cypress/commit/4524ecc89bf5cbe41f681a7aa3a65bbb37074e47)]

v3.8.17 / 2019-11-05
====================

* 3.8.17 [[2869b3e](https://github.com/applitools/eyes-cypress/commit/2869b3e05057bf14db0f08d09ba20a4446cfa9eb)]

v3.8.16 / 2019-11-05
====================

* 3.8.16 [[b940b00](https://github.com/applitools/eyes-cypress/commit/b940b0041de51a0fcac5ffd0bedea670692bb7a2)]

v3.8.15 / 2019-11-05
====================

* 3.8.15 [[b0c974e](https://github.com/applitools/eyes-cypress/commit/b0c974e9db012025122745713fb51cb41f493b0c)]
* updated ds to support textarea value accessors [[50d1b61](https://github.com/applitools/eyes-cypress/commit/50d1b61e4b76692e272771c5413f1890826c998d)]
* changelog [[9e726f5](https://github.com/applitools/eyes-cypress/commit/9e726f5ce98c3fde08e436e4d12b09c79a6f1ff8)]

v3.8.14 / 2019-10-30
====================

* 3.8.14 [[b1f08be](https://github.com/applitools/eyes-cypress/commit/b1f08be044dfe3482296743e8eef46f67b4dd408)]
* updated ds to support js select values [[3a0ce39](https://github.com/applitools/eyes-cypress/commit/3a0ce39368faa8eb83783a103951b40c3d49863c)]
* changelog [[b870c26](https://github.com/applitools/eyes-cypress/commit/b870c26e5d70185298c28376db6fbf4251ba5328)]

v3.8.13 / 2019-10-27
====================

* 3.8.13 [[5dfa7c4](https://github.com/applitools/eyes-cypress/commit/5dfa7c4716cade78aad9247d9f2b18e812c7040e)]
* updated ds to map value from all input types [[731cc47](https://github.com/applitools/eyes-cypress/commit/731cc47aa8b60ce963687f87a275e6112cf0b3f7)]
* changelog [[f1953dc](https://github.com/applitools/eyes-cypress/commit/f1953dce456c785fd302ed99d65d01d14b3534b3)]

v3.8.12 / 2019-10-27
====================

* 3.8.12 [[e9449a5](https://github.com/applitools/eyes-cypress/commit/e9449a583b3670556466fa00b44505cbbaa29836)]
* updated vgc to not parse blobs [[03cf8c5](https://github.com/applitools/eyes-cypress/commit/03cf8c506be10f997325548ff080f78c95795eb8)]
* changelog [[e1176c3](https://github.com/applitools/eyes-cypress/commit/e1176c3122db51dfab91f96c63770ee3e9027b77)]

v3.8.11 / 2019-10-27
====================

* 3.8.11 [[060d45b](https://github.com/applitools/eyes-cypress/commit/060d45bb4031283bc2c21e4d798e9bb0250f790e)]
* updated ds to duck type css rules [[9c12d19](https://github.com/applitools/eyes-cypress/commit/9c12d19068cc899f88b5da701c9cac414f4951f4)]
* changelog [[07ad6e0](https://github.com/applitools/eyes-cypress/commit/07ad6e0af86d41b82be9b49cf4eeb89952fd070b)]

v3.8.10 / 2019-10-16
====================

* 3.8.10 [[bb5ecd5](https://github.com/applitools/eyes-cypress/commit/bb5ecd5363ce74d167eda0c694dde458eeb3ef74)]
* now using only one ts defenitio file [[1d8ada6](https://github.com/applitools/eyes-cypress/commit/1d8ada66d04b31b25036dde524427ef60a530e19)]
* removed saveCdt property (we have DEBUG_SAVE=1) [[9cf2bd6](https://github.com/applitools/eyes-cypress/commit/9cf2bd65e48078552efb509921fb3c555be2deb1)]

v3.8.9 / 2019-10-15
===================

* 3.8.9 [[7ac58f1](https://github.com/applitools/eyes-cypress/commit/7ac58f12fffd002bab169dbd705a78d6f7b853a1)]
* using vgc ts defenition file [[260dd80](https://github.com/applitools/eyes-cypress/commit/260dd80802de18b31d96a08dd008119348cf698e)]
* changelog [[287d90a](https://github.com/applitools/eyes-cypress/commit/287d90a2f0b67e5f2e1c473ae6999abe527dce14)]

v3.8.8 / 2019-10-10
===================

* 3.8.8 [[8f5506f](https://github.com/applitools/eyes-cypress/commit/8f5506fd414bb44817ad06cdfd3920210afd506c)]
* added content regions to eyesCheckWindow [[ef09ed7](https://github.com/applitools/eyes-cypress/commit/ef09ed790086efd6fad2696cf27bfa51426a73f7)]
* updated vgc to have accessibility to Testresults [[d84769f](https://github.com/applitools/eyes-cypress/commit/d84769f7124bc960958e1acb05b6c863b960452c)]
* changelog [[0b00a5f](https://github.com/applitools/eyes-cypress/commit/0b00a5fd48bb5bc3680a32d76b8322d46f1f9a1a)]

v3.8.7 / 2019-10-02
===================

* 3.8.7 [[9cddd82](https://github.com/applitools/eyes-cypress/commit/9cddd82bacc879a86b0f613a8254df9b5d39ed98)]
* added index.d.ts to package.json [[b34b970](https://github.com/applitools/eyes-cypress/commit/b34b970584d38e09eb4c13437d43a65bb978e140)]
* readme change 2 [[2c23f1e](https://github.com/applitools/eyes-cypress/commit/2c23f1ed13358197c65b6443d25d38ddd149f18e)]
* readme change [[74ba93f](https://github.com/applitools/eyes-cypress/commit/74ba93ff1cdbc0dd867b57ad659ce5cedf469b39)]
* changelog [[3419cce](https://github.com/applitools/eyes-cypress/commit/3419cce6285a878cc0a596f0cb1871823b75e9ae)]

v3.8.6 / 2019-09-29
===================

* 3.8.6 [[2bbf855](https://github.com/applitools/eyes-cypress/commit/2bbf8557a2a90ab02ead31687446f9498cd57f48)]
* better Intelligent Code Completion [[3b70c08](https://github.com/applitools/eyes-cypress/commit/3b70c08b42710234382b7856cb98290a8ace1aa2)]
* changelog [[1b1e8c0](https://github.com/applitools/eyes-cypress/commit/1b1e8c0a227658a67b2f65605d6d37a8e786fb87)]

v3.8.5 / 2019-09-24
===================

* 3.8.5 [[6edbe1c](https://github.com/applitools/eyes-cypress/commit/6edbe1c002a6e5b716fe1861d7048abf0136166c)]
* added closeBatch [[cdbc4e7](https://github.com/applitools/eyes-cypress/commit/cdbc4e7034f4e4eca5002a825e795262b864dd84)]
* removed extra accessibility stuff i forgot to remove from readme [[afcf935](https://github.com/applitools/eyes-cypress/commit/afcf935aa3e8778c0f000023370561c8842b5533)]
* changed config.js [[6e73935](https://github.com/applitools/eyes-cypress/commit/6e73935bd6bba02623f02be90f90ca4348576dec)]
* changes concurrency message again [[cef3d50](https://github.com/applitools/eyes-cypress/commit/cef3d506cc277499f040ae68d48a984c2f43cecd)]
* changelog [[3f6e680](https://github.com/applitools/eyes-cypress/commit/3f6e6809984357813e09bdf047860f9641f7f4d0)]

v3.8.4 / 2019-09-23
===================

* 3.8.4 [[a1e05e3](https://github.com/applitools/eyes-cypress/commit/a1e05e34a1f5f1225a0e43f4e88643aa9ae3ebdb)]
* changes concurrency message [[672852e](https://github.com/applitools/eyes-cypress/commit/672852e0518b36f92cc28cd47619eebf57fede0f)]
* changelog [[0f57fe0](https://github.com/applitools/eyes-cypress/commit/0f57fe09c71c5034f3605d509fad64539b2b7f47)]

v3.8.3 / 2019-09-22
===================

* 3.8.3 [[62209ad](https://github.com/applitools/eyes-cypress/commit/62209ad45533d7459b542a88d7a2c1f2bf558d68)]
* fixed ts files for new accessibilityType [[addf46b](https://github.com/applitools/eyes-cypress/commit/addf46b822973f971e9ccc998ab94a33a0e8d5c9)]
* changelog [[6a937c2](https://github.com/applitools/eyes-cypress/commit/6a937c2f41f028665cc0ffc61db78fa1d62e752e)]

v3.8.2 / 2019-09-22
===================

* 3.8.2 [[088dcb9](https://github.com/applitools/eyes-cypress/commit/088dcb92f4a9aa45c0d42ed75e5c4ab99b14f462)]
* removed Nonde from accessibility [[a0bc2f4](https://github.com/applitools/eyes-cypress/commit/a0bc2f4bac445ce091c9de46adb9e0f110bf6264)]
* changelog [[822d8d2](https://github.com/applitools/eyes-cypress/commit/822d8d25b3f7a92682e9644d6c4a9c95ce9eae86)]

v3.8.1 / 2019-09-22
===================

* 3.8.1 [[e9807b2](https://github.com/applitools/eyes-cypress/commit/e9807b233a4f5009ee3124b9805f4ab97eaf39d9)]
* added accessibility and notifyOnComplete [[32e68e6](https://github.com/applitools/eyes-cypress/commit/32e68e6a3841750356253d31761f411de8d13527)]
* added ts files to package json for publishing [[b7d9c14](https://github.com/applitools/eyes-cypress/commit/b7d9c1465751f05dfc895053e1ebecbebc9fe2c0)]
* moved eyes.ts to root as well [[03b4d14](https://github.com/applitools/eyes-cypress/commit/03b4d148e221ce0b07ae3bcffbd9c280ec2948e0)]
* moved eyes-index.d.ts location to root and doc changes [[6022bcb](https://github.com/applitools/eyes-cypress/commit/6022bcbd00f9684a3ba16c09bf81728755649f2a)]
* updated readme for TypeScript [[b3caa95](https://github.com/applitools/eyes-cypress/commit/b3caa953505aebc0527bc58c1ccb8514c8222911)]
* updated readme for TypeScript [[e57276d](https://github.com/applitools/eyes-cypress/commit/e57276ddfa9e4faea8a474e799ccf4b80d790c64)]
* changelog [[945491c](https://github.com/applitools/eyes-cypress/commit/945491c8c242056b8dbf5bfa52dab5459d45c4ff)]

v3.7.5 / 2019-09-11
===================

* 3.7.5 [[1e0b5eb](https://github.com/applitools/eyes-cypress/commit/1e0b5ebda416756c309b66f22a4c9c0d2883551e)]
* added referrer to checkwindow calls [[3e83a1b](https://github.com/applitools/eyes-cypress/commit/3e83a1bb026dde445f3d5abb1063817780b2e9bf)]
* changelog [[f156ef9](https://github.com/applitools/eyes-cypress/commit/f156ef93c340b1dfefab6dcd3cc541a83aa33870)]

v3.7.4 / 2019-09-10
===================

* 3.7.4 [[cb7e74e](https://github.com/applitools/eyes-cypress/commit/cb7e74eb361bbed4e083c5b6393ee3dfb1033dd5)]
* updated ds to new api names [[ee4e7cb](https://github.com/applitools/eyes-cypress/commit/ee4e7cb620f959f55fecd2d02b401aefbc69de22)]
* better reade for proxy [[532e198](https://github.com/applitools/eyes-cypress/commit/532e19868cfa265973cba120a4f936b3787fd079)]
* changelog [[05e288f](https://github.com/applitools/eyes-cypress/commit/05e288fda2650fbc0fb3519e5cbdafbf43609de0)]

v3.7.3 / 2019-08-26
===================

* 3.7.3 [[8818ffd](https://github.com/applitools/eyes-cypress/commit/8818ffd39e57a350aab39e4fea9cd547046ed44d)]
* updated ds: fixed srcset [[f2a3326](https://github.com/applitools/eyes-cypress/commit/f2a33268af574a333c4dcc4478e148bef5d42daf)]
* changelog [[e7bfad4](https://github.com/applitools/eyes-cypress/commit/e7bfad45501b85bbc8d6fa34ad4002f97b66acd8)]

v3.7.2 / 2019-08-25
===================

* 3.7.2 [[0bc317e](https://github.com/applitools/eyes-cypress/commit/0bc317e7a22bb8169f1d8dfb08af5cc64860922a)]
* updated ds: fixed iframes with base tag url [[d59d8d2](https://github.com/applitools/eyes-cypress/commit/d59d8d2d01a7615eafad8c668e907930e824f10a)]
* changelog [[4b9c4c9](https://github.com/applitools/eyes-cypress/commit/4b9c4c9dea538c3da35f07c41c4bc14a8364cdb8)]

v3.7.1 / 2019-08-19
===================

* 3.7.1 [[d1eb1fc](https://github.com/applitools/eyes-cypress/commit/d1eb1fc8cfbc57ffb6b2ef6d090781ff1d7a24fd)]
* added typescript support [[04124cd](https://github.com/applitools/eyes-cypress/commit/04124cd3b2775580cf49cd271286a02ec545fea5)]
* changelog [[e358562](https://github.com/applitools/eyes-cypress/commit/e3585628e19d8abbc7f8952d2029041d9af0a534)]

v3.6.51 / 2019-08-19
====================

* 3.6.51 [[20a6ddc](https://github.com/applitools/eyes-cypress/commit/20a6ddc92256d6a7ef4e36a285a3d80f366781af)]
* updated ds to support about:blank inline frames [[80b6fa4](https://github.com/applitools/eyes-cypress/commit/80b6fa44239fa01fc2b2ad83675b6460bab595e2)]
* changelog [[9de59e4](https://github.com/applitools/eyes-cypress/commit/9de59e48b391c4e7b2d987a498c1719a71bd5bc2)]

v3.6.50 / 2019-08-15
====================

* 3.6.50 [[69a39e2](https://github.com/applitools/eyes-cypress/commit/69a39e21c4f07ef4ff4f6fe3fb35fe9ef1ec257b)]
* updated ds to support input type=image [[0e9107e](https://github.com/applitools/eyes-cypress/commit/0e9107e7785fef0294bfd1439c4d759eb85e7e5c)]
* changelog [[62d4e22](https://github.com/applitools/eyes-cypress/commit/62d4e2213f2203c92106130dfeaf90116b8776b6)]

v3.6.49 / 2019-08-11
====================

* 3.6.49 [[866464d](https://github.com/applitools/eyes-cypress/commit/866464d9d8cf46143b2b574a87158899960c4163)]
* updated ds to remove anchors from css resources [[33c6758](https://github.com/applitools/eyes-cypress/commit/33c6758ba0e87a7aa4435fe3b9dfc3a5b510a8a8)]
* changelog [[cb99918](https://github.com/applitools/eyes-cypress/commit/cb999182f8d6bdbb97131e250f6cd2e825b45d86)]

v3.6.48 / 2019-08-08
====================

* 3.6.48 [[b6a8cba](https://github.com/applitools/eyes-cypress/commit/b6a8cba951e7aece53bef6b5653c0a1246d70fa1)]

v3.6.47 / 2019-08-08
====================

* 3.6.47 [[c87edc6](https://github.com/applitools/eyes-cypress/commit/c87edc67528fd1f87b233c0ccfd17035875e81d4)]
* updated vgc to better error handeling [[59e5a48](https://github.com/applitools/eyes-cypress/commit/59e5a48ef14679dbb617e898d1be1c8056191198)]
* changelog [[421daa5](https://github.com/applitools/eyes-cypress/commit/421daa5f866f013e086d9dbbcb72c5f363509b82)]

v3.6.46 / 2019-08-01
====================

* 3.6.46 [[94a01fb](https://github.com/applitools/eyes-cypress/commit/94a01fb591e1db5388ded9945a834838ab1c0ba0)]
* returned css from svg and with links [[fc26846](https://github.com/applitools/eyes-cypress/commit/fc2684605b2959d274e41305ce334a00b23e0837)]
* changelog [[97e7b01](https://github.com/applitools/eyes-cypress/commit/97e7b013eb4c2a37e4b9d7ba35884b623c323a95)]

v3.6.45 / 2019-07-31
====================

* 3.6.45 [[1dd4255](https://github.com/applitools/eyes-cypress/commit/1dd425554dbc382c445370a0b344ae7c858575fc)]
* revert css from svg [[7b70c61](https://github.com/applitools/eyes-cypress/commit/7b70c61fa5e2b09ee1cc814de2273c70714a8868)]
* changelog [[ec20d34](https://github.com/applitools/eyes-cypress/commit/ec20d34d27b9115a00dac51c457ec53767acdd91)]

v3.6.44 / 2019-07-31
====================

* 3.6.44 [[e68f048](https://github.com/applitools/eyes-cypress/commit/e68f048ef6c22ab3d8f9125f5821144e58bb3355)]
* extracting urls from css in svg [[69d8c4d](https://github.com/applitools/eyes-cypress/commit/69d8c4d073cdc23ac0dcc04271bec0a56c74273c)]
* changelog [[cbf6db5](https://github.com/applitools/eyes-cypress/commit/cbf6db5bd02f07f6dc54ace1c055a2d057381dc5)]

v3.6.43 / 2019-07-28
====================

* 3.6.43 [[7ef4372](https://github.com/applitools/eyes-cypress/commit/7ef4372a1e9d5b77bc47962aae5d9fefe11d65cb)]
* updated ds to support dynamic input values [[21a0de1](https://github.com/applitools/eyes-cypress/commit/21a0de1a845d98ce430977893b6f83acb82612ac)]
* changelog [[b74e93a](https://github.com/applitools/eyes-cypress/commit/b74e93a9e1c7633ee804111aa7fc7aa8dc0f11df)]

v3.6.42 / 2019-07-25
====================

* 3.6.42 [[00fe04e](https://github.com/applitools/eyes-cypress/commit/00fe04e031c83503d3995222492e2d64970c4814)]
* updated vgc to gaurd browser with no size [[11f0841](https://github.com/applitools/eyes-cypress/commit/11f08413a9408e8a3c278cec50ac111f3a49f021)]
* changelog [[75ceacc](https://github.com/applitools/eyes-cypress/commit/75ceacc058fd4383aafec8b4b9709357fd00c914)]

v3.6.41 / 2019-07-24
====================

* 3.6.41 [[4579652](https://github.com/applitools/eyes-cypress/commit/45796527f5086b873f2e0bd915ec6cc26251e349)]
* updated ds to 1.4.4: supporting inline frames [[081a2d1](https://github.com/applitools/eyes-cypress/commit/081a2d14c2cc0c9bb552a622540ff314d78d4efd)]
* play changes 2 [[66d401e](https://github.com/applitools/eyes-cypress/commit/66d401ec51e124e45ca0e7fc4bd3c69eb6680297)]
* play changes [[21e9860](https://github.com/applitools/eyes-cypress/commit/21e98608fad702914a469e3c37c419cd80decfe5)]
* config file fix [[e898759](https://github.com/applitools/eyes-cypress/commit/e898759f2c266a51c5307d43b8f36d5e82e586db)]
* chaneglog [[1021dab](https://github.com/applitools/eyes-cypress/commit/1021dabba3a5afbbdf22a83c2a22c2fee886cc19)]

v3.6.40 / 2019-07-16
====================

* 3.6.40 [[936e7b7](https://github.com/applitools/eyes-cypress/commit/936e7b7cfc9424f6f0bcbea7f7cd451025c75a50)]
* updated vgc to support ignore regions errors [[4a4e099](https://github.com/applitools/eyes-cypress/commit/4a4e099b8cf8599912c32e5c3bb65e9fbb327714)]
* fixed readme [[2a8ebc6](https://github.com/applitools/eyes-cypress/commit/2a8ebc68c242539eddc68505403566ed7796b218)]
* changelog [[c4b58b8](https://github.com/applitools/eyes-cypress/commit/c4b58b8b7df810390adaf434421bf7f92a451a69)]

v3.6.39 / 2019-07-15
====================

* 3.6.39 [[3707084](https://github.com/applitools/eyes-cypress/commit/3707084de013a741fd96beb1ef5937e5504dff16)]
* updated ds: fixed probablyCORS and iframe cssRules [[ca17149](https://github.com/applitools/eyes-cypress/commit/ca171491afd366dce07d7f0f223983afb32537b8)]
* changelog [[53162d9](https://github.com/applitools/eyes-cypress/commit/53162d9f399e732105bf0ea238a4689e6e9ac060)]

v3.6.38 / 2019-07-11
====================

* 3.6.38 [[de5fbfc](https://github.com/applitools/eyes-cypress/commit/de5fbfcf9454835b051dd088e85d5b565568add4)]
* updated ds to support base tag [[5598de9](https://github.com/applitools/eyes-cypress/commit/5598de9069b3f510dcc9dcc04b9e884931d926d3)]
* changelog [[1c031c0](https://github.com/applitools/eyes-cypress/commit/1c031c007fc8db8c03e633387a289881a7c6cc2e)]

v3.6.37 / 2019-07-10
====================

* 3.6.37 [[50b71f3](https://github.com/applitools/eyes-cypress/commit/50b71f34567699a71b1c15c68ce1376ad805cd8b)]
* updatde vgc & ds to support canvas [[8572ba3](https://github.com/applitools/eyes-cypress/commit/8572ba3c002b8fe44d6ebb34fd6290f8ac2f1f13)]
* changelog [[ed9fa3f](https://github.com/applitools/eyes-cypress/commit/ed9fa3faf22c7eac97815f0dad52679c7c0ff95d)]

v3.6.36 / 2019-07-08
====================

* 3.6.36 [[433b79a](https://github.com/applitools/eyes-cypress/commit/433b79aa80fa6335e369421c798154cb89d0032f)]
* switched to target instead of sizeMode [[b0d5127](https://github.com/applitools/eyes-cypress/commit/b0d5127db486d0201df8ba2353a747624d0fda32)]
* changelog [[c620e23](https://github.com/applitools/eyes-cypress/commit/c620e2308328c0457350bcb7974e282041411f5c)]

v3.6.35 / 2019-07-04
====================

* 3.6.35 [[039e00f](https://github.com/applitools/eyes-cypress/commit/039e00fd1bca16348ed47f858f4d7ecc0c819fff)]
* updated ds to support cssRules getting CORS [[877f26b](https://github.com/applitools/eyes-cypress/commit/877f26b8daca67753c571a2b2055b5e6e3f0b41c)]
* play changes [[e98c0f3](https://github.com/applitools/eyes-cypress/commit/e98c0f3cc50d9fa37a8297721146ed955b8b9321)]
* play changes [[db85ac1](https://github.com/applitools/eyes-cypress/commit/db85ac1c39700231db264b424268443d106540bc)]
* updated cypress version for dev [[95a2a06](https://github.com/applitools/eyes-cypress/commit/95a2a06d84b07ebafbc81013292b134868ce62f9)]
* changelog [[2aad0d0](https://github.com/applitools/eyes-cypress/commit/2aad0d0b469645cbadbc1031cbfedea968c0365a)]

v3.6.34 / 2019-06-26
====================

* 3.6.34 [[1a7bc29](https://github.com/applitools/eyes-cypress/commit/1a7bc294bcc2391876a3ff8e8266104431672d27)]
* updated ds to suport shadow dom resources [[b44bd4f](https://github.com/applitools/eyes-cypress/commit/b44bd4f22371a58718eb4e0e688cc5dfeb7e00d1)]
* fixed sanity [[15ab042](https://github.com/applitools/eyes-cypress/commit/15ab042af1101b8d7b12c75219d0d0b0ce64c06a)]
* changelog [[5805ed1](https://github.com/applitools/eyes-cypress/commit/5805ed1f75cb8076c190843814cfb071f944995b)]

v3.6.33 / 2019-06-25
====================

* 3.6.33 [[862cad3](https://github.com/applitools/eyes-cypress/commit/862cad39641c7bc8b0d295cd20191f386d9164d7)]
* updated vgc to support renderId [[003f204](https://github.com/applitools/eyes-cypress/commit/003f2045e577ee8feb62c9e5fd9bc47241afa84e)]
* changelog [[959c2c1](https://github.com/applitools/eyes-cypress/commit/959c2c1ad3677bb0c567316cd666baf820570aa7)]

v3.6.32 / 2019-06-23
====================

* 3.6.32 [[0b1bb74](https://github.com/applitools/eyes-cypress/commit/0b1bb746d68e9cbbff4c22cd264845bf150418e1)]
* removed raw css text from cdt [[98f656a](https://github.com/applitools/eyes-cypress/commit/98f656a902e311a28f4439618b1c9c6b364e9238)]
* changelog [[502742b](https://github.com/applitools/eyes-cypress/commit/502742b2fcda439e935e02fcbd4e48f4ce2e6947)]

v3.6.31 / 2019-06-20
====================

* 3.6.31 [[1a6e19f](https://github.com/applitools/eyes-cypress/commit/1a6e19fdee15b67e75cb5e29d3a6a8d60bd51cd0)]
* updated ds to support bad css url functions [[b99fac1](https://github.com/applitools/eyes-cypress/commit/b99fac14b51dc0fc9d3a532053a49f730a221604)]
* play changes [[b29e8f6](https://github.com/applitools/eyes-cypress/commit/b29e8f6d025edcdc6794fe74c8f161a2bd2b014e)]
* changelog [[db76809](https://github.com/applitools/eyes-cypress/commit/db7680926a792b7481182a41734415f2ee00d1a4)]

v3.6.30 / 2019-06-20
====================

* 3.6.30 [[a899db4](https://github.com/applitools/eyes-cypress/commit/a899db4d550de3b78112ba26bf814f9c984ce849)]
* updated ds to take namespaced attr names [[7a6c19d](https://github.com/applitools/eyes-cypress/commit/7a6c19d650787895bf3c86f48fe2c3f4e3a608a3)]
* changelog [[4188501](https://github.com/applitools/eyes-cypress/commit/4188501ec59bc0a52516f87090aad09b4031d823)]

v3.6.28 / 2019-06-19
====================

* 3.6.28 [[e1d4f20](https://github.com/applitools/eyes-cypress/commit/e1d4f20e3314db0a5b37fe30ad744e5ba1733fee)]
* fixed eyes-setup [[3989e97](https://github.com/applitools/eyes-cypress/commit/3989e97c1fb660b513a269b6fced69cbc5878605)]
* changelog [[8b08167](https://github.com/applitools/eyes-cypress/commit/8b08167dabae1362ebe675f6d979514547dce614)]

v3.6.27 / 2019-06-18
====================

* 3.6.27 [[5ffd490](https://github.com/applitools/eyes-cypress/commit/5ffd4909340f33d2fb5ad5d0123ef46603111922)]
* updated vgc & ds to suppoort un anchoring urls [[1b4f43f](https://github.com/applitools/eyes-cypress/commit/1b4f43f99dd0df9e784bb117eac0dc812a1eb887)]
* changelog [[0f007d7](https://github.com/applitools/eyes-cypress/commit/0f007d7e52af59d1ac03ae6d4df3d3ebe175d78b)]

v3.6.26 / 2019-06-18
====================

* 3.6.26 [[baf589e](https://github.com/applitools/eyes-cypress/commit/baf589eeae7eb773b852c280e005db72afd55e94)]
* fixed css uri encoding [[fe984e9](https://github.com/applitools/eyes-cypress/commit/fe984e9c23c20d0a7530a83f66ea9cd7f3c796ad)]

v3.6.25 / 2019-06-17
====================

* 3.6.25 [[457ede0](https://github.com/applitools/eyes-cypress/commit/457ede03a2208bff1a1172c4c7aeaf34940e3bf4)]
* fixed spread operator in vgc [[0cfd0e0](https://github.com/applitools/eyes-cypress/commit/0cfd0e04dca0d63fd1a35676c0dd61758529d81b)]
* changelog [[010c3b5](https://github.com/applitools/eyes-cypress/commit/010c3b5665989f3c0511bc5b9bbba4cb2395568a)]

v3.6.24 / 2019-06-16
====================

* 3.6.24 [[e1427ee](https://github.com/applitools/eyes-cypress/commit/e1427eea3b07404ef7aac355212d101741571942)]
* updated vgc and ds: fix agentId and non 200 status codes [[05de827](https://github.com/applitools/eyes-cypress/commit/05de827b638c9c1c14534915a559a26b78782d76)]

v3.6.23 / 2019-06-13
====================

* 3.6.23 [[9a4ec78](https://github.com/applitools/eyes-cypress/commit/9a4ec788c14e9162a46c2199c83c4aebee609ffb)]
* css tokenizer v2 [[d2fc603](https://github.com/applitools/eyes-cypress/commit/d2fc603b6728935d92ebd563d5bec5cf10418fc0)]
* play cahnges [[9d74327](https://github.com/applitools/eyes-cypress/commit/9d743276f27ec627e23cb5f64ec8b930098b274b)]
* sanity changes [[ef898c3](https://github.com/applitools/eyes-cypress/commit/ef898c3423884601e45a244e4d7953de5b67e3a0)]
* sanity changes [[0f2b8bb](https://github.com/applitools/eyes-cypress/commit/0f2b8bb16008ad12c90a2386a478c7bac03deb3c)]
* added serverUrl to readme [[20ce0cc](https://github.com/applitools/eyes-cypress/commit/20ce0ccb8d4d74b285c67045f61b93baab03711d)]
* changelog [[780a072](https://github.com/applitools/eyes-cypress/commit/780a0725d9046ea2e173ab50b72d81d934eeb841)]

v3.6.22 / 2019-06-06
====================

* 3.6.22 [[1d1df94](https://github.com/applitools/eyes-cypress/commit/1d1df941cb4eb018a1c26d488a8c1da237d8a09d)]
* updated vgc to 12.11.4: svg fetch support [[7d1486f](https://github.com/applitools/eyes-cypress/commit/7d1486f7d1cd133800bf0cd2a969553b7d2de3fd)]
* changelog [[03f20b3](https://github.com/applitools/eyes-cypress/commit/03f20b305cb03f7ab1729d154f725ce0e509dfba)]

v3.6.21 / 2019-06-05
====================

* 3.6.21 [[8074a1e](https://github.com/applitools/eyes-cypress/commit/8074a1e2e40d334467a1ab26ec02b253eb8638a0)]
* svg support [[e1d3ae5](https://github.com/applitools/eyes-cypress/commit/e1d3ae5643957d644b287715e25ce5f2494769ee)]
* changelog [[27ceae9](https://github.com/applitools/eyes-cypress/commit/27ceae93a33db9bc98806dbac40bd141afd6265e)]

v3.6.20 / 2019-06-04
====================

* 3.6.20 [[8a81349](https://github.com/applitools/eyes-cypress/commit/8a813492af19ebac647ce56cc58f21ada23d40e3)]
* added batchSeqenceName [[8caa638](https://github.com/applitools/eyes-cypress/commit/8caa638856b1ea806b16ea7ef15d711e910b2fea)]
* better sanity spec [[0047081](https://github.com/applitools/eyes-cypress/commit/00470816ee44091df63c05f960b14e5f00403102)]
* 23 sanity tests for good easy baseline comparison ! [[d364fac](https://github.com/applitools/eyes-cypress/commit/d364fac164818e292052a509de13349485689010)]
* changelog [[015b85c](https://github.com/applitools/eyes-cypress/commit/015b85c2e01d946aea778a2399405a84a3bdd2d7)]

v3.6.19 / 2019-06-03
====================

* 3.6.19 [[7084c80](https://github.com/applitools/eyes-cypress/commit/7084c8089253693c237faad46ad573e201390877)]
* Using user agent of driver to fetch resources [[7dd8823](https://github.com/applitools/eyes-cypress/commit/7dd882386e313525f2fea28f7942c9b061718e34)]
* added sanity file [[5d3607c](https://github.com/applitools/eyes-cypress/commit/5d3607cf841181513e1a5ec7de6f14a917bfd0db)]
* added sanity spec for playing with and node notifier [[512cca1](https://github.com/applitools/eyes-cypress/commit/512cca164439edc1ad4a9f3b8289b6810f483260)]
* changelog [[3afa1c4](https://github.com/applitools/eyes-cypress/commit/3afa1c4e8b56960fc00eae866742c4fe54a6aa4b)]

v3.6.18 / 2019-05-30
====================

* 3.6.18 [[9483902](https://github.com/applitools/eyes-cypress/commit/9483902a186f533125c17466fb115036cdf77756)]
* reverted vgc to use cssom [[63eb3db](https://github.com/applitools/eyes-cypress/commit/63eb3dbbdc2487ee3522ec643f2a0241aa5e80f2)]
* changelog [[9974922](https://github.com/applitools/eyes-cypress/commit/9974922a8cebc8b502a40f2253077ddbdac98f74)]

v3.6.17 / 2019-05-29
====================

* 3.6.17 [[6a9a2b9](https://github.com/applitools/eyes-cypress/commit/6a9a2b9f6b4237d1847f9447b963a77b2a8ac08f)]
* updated vgc to 10.10.2: using css tokenizer instead of cssom [[229affc](https://github.com/applitools/eyes-cypress/commit/229affce561c20e42693b648468d915d452c9ac7)]
* changelog [[098fc78](https://github.com/applitools/eyes-cypress/commit/098fc78e50ea80938fc7b6533b4428f963818246)]

v3.6.16 / 2019-05-29
====================

* 3.6.16 [[b86e319](https://github.com/applitools/eyes-cypress/commit/b86e319f3cfc50c5e97b57bb19d497aaec5ea350)]
* added ignoreDisplacements [[764da7e](https://github.com/applitools/eyes-cypress/commit/764da7ee1a4bbf6188100f13bf494c36d96cc06d)]
* updated cypress [[cfa0e4f](https://github.com/applitools/eyes-cypress/commit/cfa0e4f99d111b2bdd1a36b9ac523ff2ab92315d)]
* better readme for batchName 2 [[e52745b](https://github.com/applitools/eyes-cypress/commit/e52745baf9106ea25cbc3d94bfa10b132f6a9566)]
* better readme for batchName [[0154ea5](https://github.com/applitools/eyes-cypress/commit/0154ea5d4a439ba7d57194ff2b005e5b6ac6df6c)]
* changelog [[e185407](https://github.com/applitools/eyes-cypress/commit/e185407da036faf89588f1022a78d535af49ea72)]

v3.6.15 / 2019-05-21
====================

* 3.6.15 [[f904406](https://github.com/applitools/eyes-cypress/commit/f9044069faace6aa168ae38a2e40cc299be308a8)]
* updated eyes common for new loggger [[3235f96](https://github.com/applitools/eyes-cypress/commit/3235f962a8f8986483a4281cdb9f67e803f42f71)]
* fixed readme [[d1afce3](https://github.com/applitools/eyes-cypress/commit/d1afce31a37dfb8427f6dae7c7fb2588b3d7641d)]
* added test cypress to gitignore [[7e83423](https://github.com/applitools/eyes-cypress/commit/7e834236359354560f9de1411b94abfb1b40c951)]
* added render script [[908ae2c](https://github.com/applitools/eyes-cypress/commit/908ae2cf27bb07877949e8ed1b6b4ac9a54273b7)]
* fixed e2e test flakiness with open timeout [[30d2633](https://github.com/applitools/eyes-cypress/commit/30d26335668a9ada7019adc24ede1d0747c1e1bf)]
* changelog [[b3b90bf](https://github.com/applitools/eyes-cypress/commit/b3b90bfb9bc71b004b6cd3c7b1edcee48accbed1)]

v3.6.14 / 2019-05-13
====================

* 3.6.14 [[86cb427](https://github.com/applitools/eyes-cypress/commit/86cb4270537e590cd37606c932d4eeeb999f4f44)]
* updated vgc to 12.9.0: aborting new empty test on render error [[fb5f084](https://github.com/applitools/eyes-cypress/commit/fb5f084d9cf43d6201874c348a46dae817a90963)]
* changelog [[2506ad4](https://github.com/applitools/eyes-cypress/commit/2506ad40e447840dae35e7aad93bf7613af86924)]

v3.6.13 / 2019-05-06
====================

* 3.6.13 [[6f1084b](https://github.com/applitools/eyes-cypress/commit/6f1084b921de71e70469bb9ec6a60847bb7ef43e)]
* updated ds to 1.1.10: empty src attribute for cors iframes [[d4ad630](https://github.com/applitools/eyes-cypress/commit/d4ad6304728591ad96766bc6c690f3ff6bb600ff)]
* changelog [[ca0d5e2](https://github.com/applitools/eyes-cypress/commit/ca0d5e2d2a6b7caa956fce33933c92a4156bb43e)]

v3.6.12 / 2019-05-06
====================

* 3.6.12 [[09e5611](https://github.com/applitools/eyes-cypress/commit/09e56119b454276e09af80d955f0c78d880247f2)]
* updated vgc to 12.8.1: aborting tests on render error [[db4dd04](https://github.com/applitools/eyes-cypress/commit/db4dd043e98156d38b709675f26339ced03c47df)]
* changelog [[5f82690](https://github.com/applitools/eyes-cypress/commit/5f82690082e713df5a20bd91c24cb441f7b6f46f)]

v3.6.11 / 2019-05-02
====================

* 3.6.11 [[4bdbb57](https://github.com/applitools/eyes-cypress/commit/4bdbb571bd45fa207a90b7152d8bdd07acb1afe1)]
* upadted vgc: fixed handle debug bad spread operator [[40bfee1](https://github.com/applitools/eyes-cypress/commit/40bfee19368881fdbe8f7c8eb2a963d4f8fbcb11)]
* changelog [[7b77f99](https://github.com/applitools/eyes-cypress/commit/7b77f9920d2c20d5064f4ae77e099e867fdb1682)]

v3.6.10 / 2019-04-30
====================

* 3.6.10 [[173b089](https://github.com/applitools/eyes-cypress/commit/173b089c9d04990a92e8f1a8f8c1c35ac5ca956d)]
* updated vgc to 12.6.10: added agentId to render request [[e34a8e3](https://github.com/applitools/eyes-cypress/commit/e34a8e3edfe962c9021b2240e16cf9dcbc552c7f)]
* removed matchTimeout from the readme [[81372da](https://github.com/applitools/eyes-cypress/commit/81372dac26fa3761e0452224cf171a407f073cdf)]
* changelog [[4903cb3](https://github.com/applitools/eyes-cypress/commit/4903cb3bd7d2911be4683b1c3b0bf2a69e31ed51)]

v3.6.9 / 2019-04-29
===================

* 3.6.9 [[3c9cdf0](https://github.com/applitools/eyes-cypress/commit/3c9cdf08d7c368bdf5ef295bb45d438c397286e5)]
* updated vgc to 12.6.9: fix css selector with size mode [[f1c832b](https://github.com/applitools/eyes-cypress/commit/f1c832bf139d19edd5afd183fc42bc8735b98ea4)]
* changelog [[cae5eb2](https://github.com/applitools/eyes-cypress/commit/cae5eb2bde26fef8b942e8b008a528376c4e60db)]

v3.6.8 / 2019-04-29
===================

* 3.6.8 [[e85a835](https://github.com/applitools/eyes-cypress/commit/e85a835edf4b9bf496ba854e0665f12268a0381b)]
* updated visual-grid-client 12.6.8: fixed multiple emulated devices [[01e91e9](https://github.com/applitools/eyes-cypress/commit/01e91e9da1abe17aa6c03649d424a25c20d78791)]
* changelog [[776972d](https://github.com/applitools/eyes-cypress/commit/776972d180a9583b5eddda35cd5857eb984b8c32)]

v3.6.7 / 2019-04-23
===================

* 3.6.7 [[8eda05e](https://github.com/applitools/eyes-cypress/commit/8eda05ed6ef5a3b7d758c3f77ed61260fd20cf7a)]
* updated vgc to 12.6.6: increased renderStatusTimeout to 1 hour [[58c6480](https://github.com/applitools/eyes-cypress/commit/58c648022849c4549aa875450473d0a587ce8491)]
* added ie10 11 readme info [[8d7ad78](https://github.com/applitools/eyes-cypress/commit/8d7ad7896bdbb53e27ec8122c921546633ed6f0c)]
* changelog [[47f2c4e](https://github.com/applitools/eyes-cypress/commit/47f2c4ecfcb9c29eb9447bbf4323de0216da09a3)]

v3.6.6 / 2019-04-11
===================

* 3.6.6 [[2b0b608](https://github.com/applitools/eyes-cypress/commit/2b0b6081e30408b535be7df25d8e7cc33aeb8a5d)]
* updated ds to 1.1.1: supporting shadow dom in sdk side [[51370b9](https://github.com/applitools/eyes-cypress/commit/51370b96703f44a279f3b73476abb8276aba16fa)]
* changelog [[077e34d](https://github.com/applitools/eyes-cypress/commit/077e34d406b1edef67be817e3f13198c1fe23f08)]

v3.6.5 / 2019-04-10
===================

* 3.6.5 [[3fa3d6e](https://github.com/applitools/eyes-cypress/commit/3fa3d6ea22bd84b109fe89ec56a88fcc969213b9)]
* updated ds to 1.0.11: fixed input not getting value propertie [[3b0ab76](https://github.com/applitools/eyes-cypress/commit/3b0ab76f5ea99d9a18011d95249844c93662ee8d)]
* changelog [[e1ed45f](https://github.com/applitools/eyes-cypress/commit/e1ed45f29f3e94fd828406924223ac0a819965a4)]

v3.6.4 / 2019-04-08
===================

* 3.6.4 [[ba9b306](https://github.com/applitools/eyes-cypress/commit/ba9b306ec538a47a14041d7bd9fc400673b90a54)]
* updated eyes-sdk-core to 5.4.1: increased PUt resource limit to 15.5MB [[175cac2](https://github.com/applitools/eyes-cypress/commit/175cac21ed8c5c92b77c889d0098fa0e364daf13)]
* added cdt files to gitignore [[5e38512](https://github.com/applitools/eyes-cypress/commit/5e38512aa8328e59c9a2d9dd86ff80d308b2a69e)]
* changelog [[53eef5d](https://github.com/applitools/eyes-cypress/commit/53eef5de3a93b2a53724c58114e4a6806c47fd87)]

v3.6.3 / 2019-03-31
===================

* 3.6.3 [[b6d4e73](https://github.com/applitools/eyes-cypress/commit/b6d4e73a5e0efab4ea026e956e3b9f454f56ef72)]
* fixed no eyeTimeout [[9870cd6](https://github.com/applitools/eyes-cypress/commit/9870cd6bee55f4f0c4f3df611152ff7e21e5c3cb)]
* 3.6.2 [[0f61219](https://github.com/applitools/eyes-cypress/commit/0f6121976a0f6baf1d2177a6b7ffb0c7a3adc2b3)]
* updated eyes-core to new Tap file format and better showLogs from ENV variables [[14f692f](https://github.com/applitools/eyes-cypress/commit/14f692f9a76705c8931439d88e0abb4d6fc624b0)]

v3.6.2 / 2019-03-31
===================

* 3.6.2 [[047de9f](https://github.com/applitools/eyes-cypress/commit/047de9fce80240e8bbcaaeec914aaca9426b9602)]
* fixed concurrency in readme [[69ba2fa](https://github.com/applitools/eyes-cypress/commit/69ba2fa2cb8dbf5b505b379540c4afa74c144489)]
* fixed showLogs in readme [[3526731](https://github.com/applitools/eyes-cypress/commit/3526731449d6ddf7a1f13ce4bbe4e7f7d07b5e41)]
* added ie and edge notes for readme [[9f3203a](https://github.com/applitools/eyes-cypress/commit/9f3203ad72883a06a0c9ab07c17446adc32f7680)]
* changelog [[2036f1a](https://github.com/applitools/eyes-cypress/commit/2036f1af1816fa91f67267df0c879f967ce5c877)]

v3.6.1 / 2019-03-14
===================

* 3.6.1 [[bfd5b87](https://github.com/applitools/eyes-cypress/commit/bfd5b87eae04070991698c3edef1671976c2ba84)]
* 3.6.0 [[2e65461](https://github.com/applitools/eyes-cypress/commit/2e654619ce2cf93474bef2923bec8337f5d518f9)]
* Added DEBUG support with namespace cypress [[9c0c989](https://github.com/applitools/eyes-cypress/commit/9c0c9892b7790f06e503d2b1eb09a661c7dac392)]
* changelog [[c758e1a](https://github.com/applitools/eyes-cypress/commit/c758e1a06456949ff13c7b255dd7449391c3549f)]

v3.5.6 / 2019-03-06
===================

* 3.5.6 [[ddad8d2](https://github.com/applitools/eyes-cypress/commit/ddad8d2626125f9a40a753a53888b2b10120008f)]
* Creating one TAP file per spec file and not overriding. [[43ea110](https://github.com/applitools/eyes-cypress/commit/43ea110d22d8ed97267b90da47ed242660185a28)]
* changelog [[ce6e328](https://github.com/applitools/eyes-cypress/commit/ce6e328cd51d0fd6a69dea7efb09bff202e98229)]

v3.5.5 / 2019-03-05
===================

* 3.5.5 [[b3776ba](https://github.com/applitools/eyes-cypress/commit/b3776ba270195ef0fb8180567391d2ed3942dd70)]

v3.5.4 / 2019-03-05
===================

* 3.5.4 [[0862d56](https://github.com/applitools/eyes-cypress/commit/0862d562669b6068494f3e77b34375af839ad3dc)]
* 2.5.3 [[e2748bf](https://github.com/applitools/eyes-cypress/commit/e2748bfd2ff12fc52628e881c981e80f2e82d778)]
* removed bad matchLevel info from README. [[8492ef9](https://github.com/applitools/eyes-cypress/commit/8492ef98982acf4b31570367196dd6ea6a600d42)]
* changelog [[91680a5](https://github.com/applitools/eyes-cypress/commit/91680a58959faea8a8c3284c96c700a71c534ecf)]

v3.5.2 / 2019-03-03
===================

* 3.5.2 [[f1d4063](https://github.com/applitools/eyes-cypress/commit/f1d4063e40cffd4fd52ae8a5e0651bf99334eced)]

v3.5.1 / 2019-03-03
===================

* 3.5.1 [[d40a923](https://github.com/applitools/eyes-cypress/commit/d40a92377130f57ab121c6b33ae1a971637625d5)]
* 3.5.0 [[b189642](https://github.com/applitools/eyes-cypress/commit/b189642fd96626c8b68480f1b7767b436ae7cae7)]
* Supporting useDom & enablePattrens [[6efe96a](https://github.com/applitools/eyes-cypress/commit/6efe96aacd64930adda63c2a4b62d8bfc1627db2)]
* changes to play script [[0f4eb47](https://github.com/applitools/eyes-cypress/commit/0f4eb4778cce23bb0b8e348be32af3d511503df8)]
* added .idea to gitignore [[cedbfcd](https://github.com/applitools/eyes-cypress/commit/cedbfcdfbe085008f2ec4f301b35a3ae733607ae)]
* small readme fix [[58fbdd1](https://github.com/applitools/eyes-cypress/commit/58fbdd1570ade882ea87d03500420508bb7b7174)]
* updated string of eyes.cypress to eyes-storybook [[1eb834f](https://github.com/applitools/eyes-cypress/commit/1eb834f023163de249f98d8e7f84ea5cc8a920da)]
* removed bad commits [[fd95b57](https://github.com/applitools/eyes-cypress/commit/fd95b57ca2a7a72eadee46cb9a969dbac6e9004c)]
* better readme indent [[d9ffb73](https://github.com/applitools/eyes-cypress/commit/d9ffb734d0c6551d4c759813dde27cd1e869e9eb)]
* better matchLevel locayion in readme [[912bdbf](https://github.com/applitools/eyes-cypress/commit/912bdbf43eb3920fdea48e144ed634308c461244)]
* better readme for layout & region [[9b51bb6](https://github.com/applitools/eyes-cypress/commit/9b51bb616234965a3697a7dce5d21af958d8968d)]
* changelog [[45ee7a0](https://github.com/applitools/eyes-cypress/commit/45ee7a051cb840ac565af1ccf6fa36b8b03a89cf)]

v3.4.12 / 2019-02-19
====================

* 3.4.12 [[3d17042](https://github.com/applitools/eyes-cypress/commit/3d1704293dccd92952ebfff30cf120ffdbd870e5)]
* new npm name [[2d02129](https://github.com/applitools/eyes-cypress/commit/2d021290aecc364f1d887288bc3175af55e016a2)]

v3.4.11 / 2019-02-19
====================

* 3.4.11 [[0f9d4dd](https://github.com/applitools/eyes-cypress/commit/0f9d4dd211f476d7a02ed46d0d51527b3f9422f7)]
* changelog [[2721dad](https://github.com/applitools/eyes-cypress/commit/2721dadaee3feb41b27323a1c90a24aa9ce34dc3)]

v3.4.10 / 2019-02-17
====================

* 3.4.10 [[96c3b70](https://github.com/applitools/eyes-cypress/commit/96c3b70126b0a18bf80df27a9feecf0846271c9a)]
* Now setting cy viewport size to the given viewort size (if the user set 1 size); In open & checkWindow. [[e371dd0](https://github.com/applitools/eyes-cypress/commit/e371dd0d5a3a108be63988ae390d71db6ef9f9c2)]
* removed unneeded config fix of env variables [[943f0a1](https://github.com/applitools/eyes-cypress/commit/943f0a16ca1f3dd74c4feaf8cc0d75a78c6a215c)]
* small package json fix [[a9620b9](https://github.com/applitools/eyes-cypress/commit/a9620b93e7dec5306b0057ca8e3d03e07ded92d9)]
* better changelog script [[ba152f8](https://github.com/applitools/eyes-cypress/commit/ba152f8442d278f13a68728bd3737619761eeecf)]
* better changelog script [[7664a31](https://github.com/applitools/eyes-cypress/commit/7664a31488aece8e4e37a2a7096fb9c6bf75496c)]
* removed bad script from package json [[610bd47](https://github.com/applitools/eyes-cypress/commit/610bd47cd9c2c98579a727a01c617963bbfe7d13)]
* better changelog init script [[4941cbb](https://github.com/applitools/eyes-cypress/commit/4941cbb658b502b4c3b17d21cf18278c1bb503da)]
* changelog [[dbbc253](https://github.com/applitools/eyes-cypress/commit/dbbc253e08a097a4dcc1d1aa1085bf8c3455816f)]

v3.4.9 / 2019-02-13
===================

* 3.4.9 [[5d39b22](https://github.com/applitools/eyes-cypress/commit/5d39b22bfe5418eeaf65ce0bd1358b59aa695b84)]
* changed play file [[b05ba3d](https://github.com/applitools/eyes-cypress/commit/b05ba3db35a1138bc8a1b1c54fdc3e68c15179b6)]
* Supporting layout & strict regions (via selectors or position). [[c9657ea](https://github.com/applitools/eyes-cypress/commit/c9657eab8071c56296f3477bca939d04d74df40b)]
* Now using GeneralUtils.getPropertyByPath for gaurding browser default viewport. [[bfd6144](https://github.com/applitools/eyes-cypress/commit/bfd6144edc7b554f51ea4e0f3103d7ab0ce072a1)]
* changelog [[d7da8a5](https://github.com/applitools/eyes-cypress/commit/d7da8a5ed2f7e367e6f319cd2f7f3b1f7516900c)]

v3.4.8 / 2019-02-12
===================

* 3.4.8 [[8a36518](https://github.com/applitools/eyes-cypress/commit/8a36518b84666c810620986eda0c13518f6e2e0d)]
* Updated Dom-snapshot to 1.0.6: Taking value property from inputs and setting them as attributes in CDT. [[dfc2240](https://github.com/applitools/eyes-cypress/commit/dfc224027b076c8a5a8984e0056b7ecb452e3355)]
* removed cdt file param in play test [[4c4914c](https://github.com/applitools/eyes-cypress/commit/4c4914cb13d10237f0270645276c9a84c0fc5e0d)]
* removed vscode dir [[54aa3ae](https://github.com/applitools/eyes-cypress/commit/54aa3ae9226cb7a2bab4d175055a92658ac5f345)]
* added debug.cdt=fileName to checkWindow [[5403b84](https://github.com/applitools/eyes-cypress/commit/5403b84df3c4652fb09079f9c11ac70c3bf59230)]
* changelog [[b10a04e](https://github.com/applitools/eyes-cypress/commit/b10a04ed3c81d13a062aa35fea62a4db4428f0b8)]

v3.4.7 / 2019-02-10
===================

* 3.4.7 [[7297c14](https://github.com/applitools/eyes-cypress/commit/7297c14a9c8e3ef44673dc1f06d81207790de6a5)]
* Now setting deafult VGC viewport size to Cypress browser size (If user did not set size). [[951c1fb](https://github.com/applitools/eyes-cypress/commit/951c1fba655250105372338df7c6639db37b4fa0)]
* changelog [[6e44ee3](https://github.com/applitools/eyes-cypress/commit/6e44ee3ff9af0699654c06ed43f571b783b964d2)]

v3.4.6 / 2019-02-07
===================

* 3.4.6 [[7c3ef6d](https://github.com/applitools/eyes-cypress/commit/7c3ef6d1f17f1789308349837081c533be8c86e4)]
* Updated VGC to 10.06: removed finally from ptimeout. Updated dom-snapshot to 1.0.5: Gaurding cssRules accessor (fails on CORS). [[ba8effe](https://github.com/applitools/eyes-cypress/commit/ba8effe962f790966414c16537cc486a84ba2873)]
* changelog [[fc496b3](https://github.com/applitools/eyes-cypress/commit/fc496b3c82abd6f88b989decac071e5e91155288)]

v3.4.5 / 2019-02-07
===================

* 3.4.5 [[d4086f6](https://github.com/applitools/eyes-cypress/commit/d4086f66e2b9dcebcb89045d62926981904683b4)]
* Updated dom-snapshot to 1.0.4: now returning checked propery as checked=true attribute in CDT. [[34b62fb](https://github.com/applitools/eyes-cypress/commit/34b62fb0efd2d66bf3637a2bf4c2d44a5a761d50)]
* even better changelog:install [[49cb354](https://github.com/applitools/eyes-cypress/commit/49cb35433d9ae32c860c56fc1edc5afbf951af17)]
* better changelog:install [[964bb60](https://github.com/applitools/eyes-cypress/commit/964bb60c31f1f4e4999779b139023efb6cb03754)]
* added changelog:install script to package.json [[0feea3c](https://github.com/applitools/eyes-cypress/commit/0feea3c0af99ee8580474d81a2f8de3f1ac36c72)]
* now really added changelog file.. [[fc5d87d](https://github.com/applitools/eyes-cypress/commit/fc5d87d4120c27ee98a73201d76eb9410a585d57)]
* fixed changelog to include Links & added changelog init script [[35893b5](https://github.com/applitools/eyes-cypress/commit/35893b58cad2a995a0d8b09dc2d64190c16fa846)]
* changelog [[a84a884](https://github.com/applitools/eyes-cypress/commit/a84a884a398c75abaf53ae9e65cc2e1541253fc7)]

v3.4.4 / 2019-02-05
===================

* 3.4.4 [[79312fa](https://github.com/applitools/eyes-cypress/commit/79312fa1c127352ca360de43d77322a8b7b188e9)]
* Updated VGC to 10.0.5: abort waits for checkWindow and having fetch timeout. [[1a9c3e6](https://github.com/applitools/eyes-cypress/commit/1a9c3e6fdae5887231ac7e9872cfb8fc39656093)]
* changelog [[c12a43c](https://github.com/applitools/eyes-cypress/commit/c12a43cd7c2180ec92d2fa9b1057f9cf05439415)]

v3.4.3 / 2019-02-05
===================

* 3.4.3 [[4331008](https://github.com/applitools/eyes-cypress/commit/4331008a101c889d591aca03b65f8a8f8a4f17a2)]
* Updated to VGC 10.0.4: Abort waiting for checkWindow & fetch now has a 2 min timeout. [[aeef57d](https://github.com/applitools/eyes-cypress/commit/aeef57d05f06818d7504caf76bea760155bed9f3)]
* changelog [[b8b1b7c](https://github.com/applitools/eyes-cypress/commit/b8b1b7cf927ee09d252c8dd9ecf28dc607e15d5a)]

v3.4.2 / 2019-01-30
===================

* 3.4.2 [[2c28b73](https://github.com/applitools/eyes-cypress/commit/2c28b73d9bdfab03868a4adeb7051bc32014a3bd)]
* Renamed tapFilePath to tapDirPath and fixed readme text. [[1a49e8b](https://github.com/applitools/eyes-cypress/commit/1a49e8b963ea3a87ed8ea1ae7b1584dedd403c47)]
* changelog [[8eb4b7a](https://github.com/applitools/eyes-cypress/commit/8eb4b7ab8dd9e04b8764344269477ab9db4c4e81)]

v3.4.1 / 2019-01-30
===================

* 3.4.1 [[5715c87](https://github.com/applitools/eyes-cypress/commit/5715c87e4a6990920bbc3cd6bc6fe1abf83b96df)]
* 3.4.0 [[cb86f47](https://github.com/applitools/eyes-cypress/commit/cb86f47ff58b192970f10d0c8e9c52b7360fd351)]

v3.3.26 / 2019-01-30
====================

* 3.3.26 [[6c61acb](https://github.com/applitools/eyes-cypress/commit/6c61acbcc2b204359a3ca8354edf344f42ae13e5)]
* Converting env variables of false and 0 to booleans (once eyes-common major is published we can use that). [[d2f3e82](https://github.com/applitools/eyes-cypress/commit/d2f3e82e89a4e55e47c9ef1ee5f63dd6e94b6757)]
* Renamed flag to not fail Cypress to ^CilCypressOnDiff [[78324be](https://github.com/applitools/eyes-cypress/commit/78324be37e33da14db575d553674064b364af2fc)]
* changelog 3.3.25 [[6dfa540](https://github.com/applitools/eyes-cypress/commit/6dfa540ad2bbf7974a50317278d49ad3155c3597)]

v3.3.25 / 2019-01-29
====================

* 3.3.25 [[d6f8791](https://github.com/applitools/eyes-cypress/commit/d6f8791bb20fbf4641e5fa1467d10c39fff18957)]
* removed dont fail on diff flag from readme - we might want to change the name [[bf8a451](https://github.com/applitools/eyes-cypress/commit/bf8a451c5e75a9bb0dd9c7934507217bb3070d1c)]
* changelog 3.3.24 [[7484083](https://github.com/applitools/eyes-cypress/commit/7484083f83aa852eff784c6ebb65a4a6a9640e57)]

v3.3.24 / 2019-01-29
====================

* 3.3.24 [[dfe6703](https://github.com/applitools/eyes-cypress/commit/dfe67032caab9eebb7fbf9d8fb9c6694dabfb099)]
* lint test files fix [[7f57dd4](https://github.com/applitools/eyes-cypress/commit/7f57dd48ceac67d612940095e2e9099c6a3949d4)]
* Added tap file config, use tapFilePath to set a path for eyes.tap file to be saved in. [[21a749f](https://github.com/applitools/eyes-cypress/commit/21a749f1243b41fdcf12a5c8d29f4aebb6ab7b2e)]
* Added dontFailOnDiff flag for not failing Cypress tests once a visual test fails. [[9754067](https://github.com/applitools/eyes-cypress/commit/9754067080aaaaec04c63bbf32e91da9a2c0238e)]
* changelog 3.3.23 [[751477e](https://github.com/applitools/eyes-cypress/commit/751477e091f58245b9a32723ed5d26d4f11b9965)]

v3.3.23 / 2019-01-28
====================

* 3.3.23 [[250ea0e](https://github.com/applitools/eyes-cypress/commit/250ea0e4507d846020928a8a387ebbc17271c1fc)]
* Renamed git repo from eyes.cypress to eyes-cypress [[75ce64e](https://github.com/applitools/eyes-cypress/commit/75ce64ed2fb3f0c0c9faf2ab7fa2819989d19fb0)]
* returned eslint to babylon [[13bccd2](https://github.com/applitools/eyes-cypress/commit/13bccd21059d72e8dbb0c89652ef0823f5d8beb8)]
* updated changelog and vhangelog command [[99e0fd9](https://github.com/applitools/eyes-cypress/commit/99e0fd9755cb4fb0bbd885067d424091bb879785)]
* updated changelog (and doing changelog cmd without jq) [[02cb491](https://github.com/applitools/eyes-cypress/commit/02cb491064938492301d931c09e83857b2875f27)]

v3.3.22 / 2019-01-20
====================

* 3.3.22 [[3d2648a](https://github.com/applitools/eyes-cypress/commit/3d2648a4fc59570619b345fdcfb451b54367f1e9)]
* Upadated dom-capture to dom-snapshot 1.0.2: Downloading all reasources in browser, if failing on CORS then returning as resourceUrl. [[49bd129](https://github.com/applitools/eyes-cypress/commit/49bd129589f9587be5e89f4192ac296868cdc9e1)]

v3.3.21 / 2019-01-20
====================

* 3.3.21 [[f3a2460](https://github.com/applitools/eyes-cypress/commit/f3a24601fba2ebb1499f01cd82259351f1c47f4a)]
* Changed the browser requests going to node to use fetch() and not cy.request(). [[5f1d690](https://github.com/applitools/eyes-cypress/commit/5f1d690d7d0017d8b821ae2bc2cb7c38dfbc7bc3)]
* 3.3.20 [[70d4667](https://github.com/applitools/eyes-cypress/commit/70d466739b9ad322b063cbc263568bff41a4797f)]
* update vgc to get isomorphic version 10 [[561284a](https://github.com/applitools/eyes-cypress/commit/561284ac6b73721f2ccf08f1e4b970d150270577)]
* add matchLevel arg to checkWindow to readme [[2c88de7](https://github.com/applitools/eyes-cypress/commit/2c88de79144143b7a88985a78a605ad36f60f681)]

v3.3.19 / 2019-01-13
====================

* 3.3.19 [[d56276f](https://github.com/applitools/eyes-cypress/commit/d56276fa911dc8738e068eec9fb9a0b7c5b3c8ad)]
* returned version nuber to 3.3.18 and removed post version script [[0d29e32](https://github.com/applitools/eyes-cypress/commit/0d29e321717aed7c203253df4bb78115375923e7)]

v3.4.0 / 2019-01-13
===================

* 3.4.0 [[6216d95](https://github.com/applitools/eyes-cypress/commit/6216d95699094477f7c5a5c6b0b9d2c41996eddc)]
* adding tag and pushing repo automatically after npm version cmd [[17df9ca](https://github.com/applitools/eyes-cypress/commit/17df9ca8ca6fe20a71801bb64aa66b7ca72dafbd)]
* change isDisabled conflict message, slight refactor, fix eslint issue [[6228b6f](https://github.com/applitools/eyes-cypress/commit/6228b6f31a3276a4f810b1072ebe995d3274457a)]
* Passing config to makePlugin now instead of getConfig. Also added it and e2e tests. [[e79c6aa](https://github.com/applitools/eyes-cypress/commit/e79c6aab4fb96667dcb7453956cb8529f4907a88)]
* First commit whoo - WIP - disabling all cmds in the browser if . [[0305391](https://github.com/applitools/eyes-cypress/commit/030539121c117aee2b8c0e6ed586704501b66246)]

v3.3.18 / 2018-12-27
====================

* 3.3.18 [[1ec71c4](https://github.com/applitools/eyes-cypress/commit/1ec71c47c279da1983ba25325110ea075a246813)]
* bundle only processPage [[15d5c9f](https://github.com/applitools/eyes-cypress/commit/15d5c9fdcbf04c3f0d883cd9763354a8c126a693)]

v3.3.17 / 2018-12-20
====================

* 3.3.17 [[53372b7](https://github.com/applitools/eyes-cypress/commit/53372b787a0cb198c103811e4a78b36a2d046562)]

v3.3.16 / 2018-12-20
====================

* 3.3.16 [[8d703a6](https://github.com/applitools/eyes-cypress/commit/8d703a642591a1f30e273e774098f0c3a710bbf9)]
* update vgc to 9.0.5, dc: 6.1.1 and fix empty content-type issue [[b9ac97e](https://github.com/applitools/eyes-cypress/commit/b9ac97ef3824bdf8d045a117bc1465b0f5f77ee0)]

v3.3.15 / 2018-12-16
====================

* 3.3.15 [[5774882](https://github.com/applitools/eyes-cypress/commit/5774882fded892e25faf2f12f947d5828a51cb6f)]
* package json [[c7ee9da](https://github.com/applitools/eyes-cypress/commit/c7ee9dae8b9dba8e19318acfbcb1fb8abf314da4)]

v3.3.14 / 2018-12-16
====================

* 3.3.14 [[fe156b5](https://github.com/applitools/eyes-cypress/commit/fe156b504d3858a2978b635da5c71e3ad1cc6504)]
* update vgc to get lazy apiKey validation [[aa62e67](https://github.com/applitools/eyes-cypress/commit/aa62e678ecebdecd365096f8de1331ee89bda573)]
* changelog [[637c78f](https://github.com/applitools/eyes-cypress/commit/637c78fe74a18de567d57a60f53f3b0ac474766b)]
* Merge pull request #15 from corevo/patch-1 [[793f782](https://github.com/applitools/eyes-cypress/commit/793f78210670b94060ae4bc36d77d9c2a3d1256c)]
* docs: examples for css/xpath selectors in checkWindow [[f7245e8](https://github.com/applitools/eyes-cypress/commit/f7245e876c3cf7fccc1a707fe06beb5e7ab0b776)]
* Added docs about selector types [[b1a5cdc](https://github.com/applitools/eyes-cypress/commit/b1a5cdc5ef7d139812a320e7a5a3de3b8f12e0b9)]

v3.3.13 / 2018-12-16
====================

* 3.3.13 [[478ca47](https://github.com/applitools/eyes-cypress/commit/478ca4727b58aab6d33f43cfb3032804216bb4f2)]
* update dc and vgc to fetch css deps from the browser [[8c285f7](https://github.com/applitools/eyes-cypress/commit/8c285f7a0f76ec4aaa25deb64355f1ee8ecdda9c)]

v3.3.12 / 2018-12-11
====================

* 3.3.12 [[a111092](https://github.com/applitools/eyes-cypress/commit/a111092db0e1d52d1b410aa69266ca00030dc51a)]
* update vgc to 8.0.6 to handle null render status [[848e6eb](https://github.com/applitools/eyes-cypress/commit/848e6ebc93631ecd21bd301b3a63b3f737f18d3c)]

v3.3.11 / 2018-12-11
====================

* 3.3.11 [[9a40fb6](https://github.com/applitools/eyes-cypress/commit/9a40fb621c1668b99f89aafbfb46a5340c761bc4)]
* update vgc to 8.0.4 to fix statuser [[f13510c](https://github.com/applitools/eyes-cypress/commit/f13510c84f88db36b5e35f6ddd9f7816c6f0a451)]

v3.3.10 / 2018-12-11
====================

* 3.3.10 [[4abe40e](https://github.com/applitools/eyes-cypress/commit/4abe40ee50508dae49a8e14b900ffb415338bb7b)]
* update vgc to 8.0.2 to get statuser [[8d7466e](https://github.com/applitools/eyes-cypress/commit/8d7466e1e928dd0f90a8826a794c87701b3999e7)]
* play stuff [[e6611b6](https://github.com/applitools/eyes-cypress/commit/e6611b63f95daf50e1461077177e8e8f250f185b)]
* update readme to reflect config exceptions and add sendDom [[77b1d9f](https://github.com/applitools/eyes-cypress/commit/77b1d9f1cd86cdc136d17d35e6ab380802f799c4)]

v3.3.9 / 2018-12-02
===================

* 3.3.9 [[e219eef](https://github.com/applitools/eyes-cypress/commit/e219eefee98732c4bbbf610832e06fc427a80df0)]
* update vgc to 7.2.8 and use the correct agentId [[d277171](https://github.com/applitools/eyes-cypress/commit/d277171ee67727a5fb0f3e8658f6f78aaaa1ae83)]

v3.3.8 / 2018-12-02
===================

* 3.3.8 [[fc883b6](https://github.com/applitools/eyes-cypress/commit/fc883b66de39e9b9664e8ded062daa7f0287c218)]
* update vgc to 7.2.7 to fix unopened transactions [[43c47e7](https://github.com/applitools/eyes-cypress/commit/43c47e76d04de7cc161cf756229c4fa4e0004ad3)]

v3.3.7 / 2018-12-02
===================

* 3.3.7 [[3303d46](https://github.com/applitools/eyes-cypress/commit/3303d4697af967658731f6bf3d57e1d9fbe91345)]
* bring the floating region feature to life [[d1c25bc](https://github.com/applitools/eyes-cypress/commit/d1c25bc0930319ca419a93e9129afe9d7b83991c)]

v3.3.6 / 2018-11-29
===================

* 3.3.6 [[9df6212](https://github.com/applitools/eyes-cypress/commit/9df6212d48b1be6aa6f04bb251eead7853010ce5)]
* fix filtering of failed tests [[c24a710](https://github.com/applitools/eyes-cypress/commit/c24a710b23a05df5a89e52550bf172329fd00448)]

v3.3.5 / 2018-11-29
===================

* 3.3.5 [[3fec07c](https://github.com/applitools/eyes-cypress/commit/3fec07cdbb8171f3055aae4b3c16b05ac7fd4520)]
* abort failed tests and add test info for failures in error digest [[1377d0c](https://github.com/applitools/eyes-cypress/commit/1377d0ce39401a75e504cbac162bc58c151b1c90)]
* changelog [[20fc20c](https://github.com/applitools/eyes-cypress/commit/20fc20ca9c274fbbffa4327656af46a275dc0d97)]

v3.3.4 / 2018-11-28
===================

* 3.3.4 [[0bf7193](https://github.com/applitools/eyes-cypress/commit/0bf7193babde8d260b03d717abebd59132e7b62c)]
* remove polling from openEyes [[de134e6](https://github.com/applitools/eyes-cypress/commit/de134e64f91f3a7b2ecd7abded2327d81e3e4e92)]
* update vgc to 7.2.4 [[f1be1bf](https://github.com/applitools/eyes-cypress/commit/f1be1bf51cda3f9486bef0ced89741d7f3e0ca74)]
* play around [[f54a4e7](https://github.com/applitools/eyes-cypress/commit/f54a4e71a324f230a8bdb9327101df8e55f1a0a0)]
* add testApp screenshots and videos to gitignore [[dded9b0](https://github.com/applitools/eyes-cypress/commit/dded9b0ba8a5a06391beb1d9a2bc7a2ac8ae5840)]
* add reference link to concurrency message [[9b77060](https://github.com/applitools/eyes-cypress/commit/9b77060cc90d79b47645959566835d31456a0470)]

v3.3.3 / 2018-11-27
===================

* 3.3.3 [[1bf648c](https://github.com/applitools/eyes-cypress/commit/1bf648c222b20c027151809c7f8285a2b7a9c472)]
* update vgc to 7.2.3 to fix render concurrency with failures [[5e7dd4c](https://github.com/applitools/eyes-cypress/commit/5e7dd4c66e1f44d3235522855dd245e54af48333)]

v3.3.2 / 2018-11-26
===================

* 3.3.2 [[e08f55c](https://github.com/applitools/eyes-cypress/commit/e08f55c168eebf5eb1183e2a787f127836df9352)]
* update vgc to 7.2.2 to fix hangs in failed renders [[9b3baad](https://github.com/applitools/eyes-cypress/commit/9b3baada4821c0474857d7e280a1dca71d235743)]

v3.3.1 / 2018-11-26
===================

* 3.3.1 [[ff2e180](https://github.com/applitools/eyes-cypress/commit/ff2e180a811bccf3316216929bd29ccfc0c97b7d)]

v3.3.0 / 2018-11-26
===================

* 3.3.0 [[5f5b689](https://github.com/applitools/eyes-cypress/commit/5f5b6894464d8a4d61efc26babc04ff0bb61529d)]
* update visual-grid-client to 7.2.1 to get proxy user/pass and perf optimization [[c33c817](https://github.com/applitools/eyes-cypress/commit/c33c8175fe4fb027bcb00fe58778cfe8d5cf6dd8)]
* changelog [[649f176](https://github.com/applitools/eyes-cypress/commit/649f17673eb99998a0ee12c8252f4fc906acbf4e)]

v3.2.26 / 2018-11-25
====================

* 3.2.26 [[0aa1799](https://github.com/applitools/eyes-cypress/commit/0aa17997df5c35eaad555116501ebe209ab009cb)]
* work directly with dom-capture [[948b4c8](https://github.com/applitools/eyes-cypress/commit/948b4c83e9477c5bc638a42f25e5f477bc8c14db)]

v3.2.25 / 2018-11-25
====================

* 3.2.25 [[af24de9](https://github.com/applitools/eyes-cypress/commit/af24de94fd2050b6d14ece7b50c6ae0bfe236058)]
* avoid sending blob content twice (no more allBlobs) [[7b77012](https://github.com/applitools/eyes-cypress/commit/7b77012a5599407efa728bbc2f9d19402b3e2e91)]
* changelog [[e4310dd](https://github.com/applitools/eyes-cypress/commit/e4310dd0cec707238f18d190991b86eade27eaa6)]

v3.2.24 / 2018-11-20
====================

* 3.2.24 [[2873a34](https://github.com/applitools/eyes-cypress/commit/2873a3471a3e9fe6cca2577307070c9e0d30142c)]
* update visual-grid-client to 6.0.1 to fix deviceInfo [[7567c4a](https://github.com/applitools/eyes-cypress/commit/7567c4af53c31d5ddf9583b0d42cdab19d73721c)]
* add scriptHooks to readme [[84c88cf](https://github.com/applitools/eyes-cypress/commit/84c88cf88629e10a5dc71eae2241c02c27b8be99)]
* license [[faaa444](https://github.com/applitools/eyes-cypress/commit/faaa444109865845460e5bef2baadd16e5ff7021)]
* play script [[9109990](https://github.com/applitools/eyes-cypress/commit/9109990a1d59bb8990051c8de2c754c9179ea6ee)]
* changelog [[85e72da](https://github.com/applitools/eyes-cypress/commit/85e72da393ac17c13e52e9bfe1b655089102aa7f)]

v3.2.23 / 2018-11-14
====================

* 3.2.23 [[336b6df](https://github.com/applitools/eyes-cypress/commit/336b6df260871120e491e4445a8095c925db1e89)]
* update visual-grid-client to 5.5.3 to get sdk-core major version [[2805eee](https://github.com/applitools/eyes-cypress/commit/2805eeed23161774bbec563043c9a4364cbcb5f0)]
* add a changelog [[de2a8ef](https://github.com/applitools/eyes-cypress/commit/de2a8efffe1b8ef70974517a34d7eee97e5c5751)]
* add play spec [[c286ee0](https://github.com/applitools/eyes-cypress/commit/c286ee043726cb92180a9e75f84cf02c3e63d3dc)]

v3.2.22 / 2018-11-13
====================

* 3.2.22 [[aecd4d2](https://github.com/applitools/eyes-cypress/commit/aecd4d2e7ecedc29bbea16532b6b4d3a05f93a37)]
* update visual-grid-client to 5.5.1 to get srcset [[f85fab9](https://github.com/applitools/eyes-cypress/commit/f85fab9760ca750bfbe5b063f8c57b6c75df2a46)]
* 3.2.21 [[1099456](https://github.com/applitools/eyes-cypress/commit/109945615730a490b5cfb8e77f58b69a2f240a8b)]
* fix issue with error in close [[68c0871](https://github.com/applitools/eyes-cypress/commit/68c08718c2ba593c01feb913ec1fe655784f8505)]
* Merge pull request #11 from jennifer-shehane/patch-1 [[7a5b060](https://github.com/applitools/eyes-cypress/commit/7a5b060cbdd3d2f1dee81359d91b95cd3989c4b9)]
* Applitoos -> Applitools [[3d0e1aa](https://github.com/applitools/eyes-cypress/commit/3d0e1aabfd7c862ebd3c2e0224007b201e0171cf)]

v3.2.21 / 2018-11-08
====================

* 3.2.21 [[4a86658](https://github.com/applitools/eyes-cypress/commit/4a8665891516c9373a9d968bb94b22a84354b6f2)]
* fix issue with error in close [[c085ecc](https://github.com/applitools/eyes-cypress/commit/c085ecc96d15c485a923b37a909c200895cff603)]

v3.2.20 / 2018-11-07
====================

* 3.2.20 [[a4e193f](https://github.com/applitools/eyes-cypress/commit/a4e193f98247aed99cb32f5503d68faf88c4672e)]
* update visual-grid-client to 5.4.2 to better validate input [[92a562f](https://github.com/applitools/eyes-cypress/commit/92a562ff94ab5e0705f9b40f18b00073a0a36540)]

v3.2.19 / 2018-11-06
====================

* 3.2.19 [[3b2f0a8](https://github.com/applitools/eyes-cypress/commit/3b2f0a8e4bf3552148175f4aecd5658c0de0d59a)]
* update visual-grid-client to 5.4.1 to get TestResultsStatus [[b0c8139](https://github.com/applitools/eyes-cypress/commit/b0c8139894075bae2ea110facbbeb18e46c58ce9)]

v3.2.18 / 2018-11-06
====================

* 3.2.18 [[e0722d7](https://github.com/applitools/eyes-cypress/commit/e0722d761d1715a6a14d820edbee6307389e6d96)]
* improve error digest to not be daunting [[0f6588c](https://github.com/applitools/eyes-cypress/commit/0f6588cca3587c79974f8694d0e2c9a2fb0a46ed)]

v3.2.17 / 2018-11-05
====================

* 3.2.17 [[f96003c](https://github.com/applitools/eyes-cypress/commit/f96003cb6699dc39907171b48bda73d7eb576ed8)]
* update visual-grid-client to 5.3.11 to fix waitForRenderStatus issue [[e99d4ae](https://github.com/applitools/eyes-cypress/commit/e99d4aec0e415cca83baa06106bee2df78608b5e)]

v3.2.16 / 2018-11-04
====================

* 3.2.16 [[a7ca810](https://github.com/applitools/eyes-cypress/commit/a7ca81083f4f031eb175da279f0aa00d6c3e51e9)]
* readme update: add browser name to device name in device emulation [[ae4b67f](https://github.com/applitools/eyes-cypress/commit/ae4b67f7bdefcbc0a39aa2b1f2e4499798228d5f)]

v3.2.15 / 2018-11-03
====================

* 3.2.15 [[503b871](https://github.com/applitools/eyes-cypress/commit/503b871c4011ab6fca8d3a11687f53dfde954dbd)]
* update visual-grid-client to 3.2.15 to fix self reference in cache [[4861b24](https://github.com/applitools/eyes-cypress/commit/4861b24d518c537acb8bb91c615de5dca3ce9fd1)]

v3.2.14 / 2018-10-28
====================

* 3.2.14 [[d1eb4fd](https://github.com/applitools/eyes-cypress/commit/d1eb4fdd90179ccdd53cffc8a4aa58cc030c3778)]
* show concurrency msg also when specified as a string (env var) [[0fb836b](https://github.com/applitools/eyes-cypress/commit/0fb836b4c81b44b02cf1fb61139212b1200769ee)]

v3.2.13 / 2018-10-28
====================

* 3.2.13 [[ec85645](https://github.com/applitools/eyes-cypress/commit/ec856451a70d7b13bd4b5b0d44e83278b40aee15)]
* add concurrency message to readme and test output [[5dcfb39](https://github.com/applitools/eyes-cypress/commit/5dcfb39298f7929c4c61693e7665b58465f53b92)]
* refactor getUrls in play task [[b5fcd95](https://github.com/applitools/eyes-cypress/commit/b5fcd95dd6e9468f913441dcee7c65299880a01b)]

v3.2.12 / 2018-10-24
====================

* 3.2.12 [[3fb7151](https://github.com/applitools/eyes-cypress/commit/3fb7151c189010f73489dca7c4b41b91ffa8efe8)]
* update visual-grid-client to 5.3.8 to support recursive resources [[a8dab2f](https://github.com/applitools/eyes-cypress/commit/a8dab2fe2e3abddf40beee4dca308374b73d48dc)]

v3.2.11 / 2018-10-23
====================

* 3.2.11 [[d41e094](https://github.com/applitools/eyes-cypress/commit/d41e094a2a3049a3deffcd687fa3192ef7fa4674)]
* update visual-grid-client to 5.3.7 to fix issue with missing resource content [[671374e](https://github.com/applitools/eyes-cypress/commit/671374ec4aa9024f9c8862167a832b005f387a73)]
* sitemap play test [[8e9b16b](https://github.com/applitools/eyes-cypress/commit/8e9b16b14e8cb3e61025219f055dc4e9dce6ca6c)]
* bigger timeout for checkWindow in the browser [[920ce7e](https://github.com/applitools/eyes-cypress/commit/920ce7e0601b47613b5bf61418b779ca3a9347d9)]

v3.2.10 / 2018-10-22
====================

* 3.2.10 [[9c21108](https://github.com/applitools/eyes-cypress/commit/9c2110814a8f0c259205c4d4cf2f825a978531d9)]
* use beforeEach and afterEach in test.js [[cf57a8a](https://github.com/applitools/eyes-cypress/commit/cf57a8ac7637ba4e7604143d3c51e7f2065a07e6)]
* use polling for openEyes [[40772e1](https://github.com/applitools/eyes-cypress/commit/40772e1877ea0e222096a1d8e0b7ea9bb2a0e938)]
* ability to pass args to polling handler's worker [[0cabf76](https://github.com/applitools/eyes-cypress/commit/0cabf7602305cb83726ca5327d5b7b5225773ce0)]

v3.2.9 / 2018-10-22
===================

* 3.2.9 [[3f3f2b1](https://github.com/applitools/eyes-cypress/commit/3f3f2b1f6cdb1edda4906da3c53f7d0387c41f13)]
* adding logs [[bef02e7](https://github.com/applitools/eyes-cypress/commit/bef02e7ddd491289626b54c07ec5214b4d719316)]

v3.2.8 / 2018-10-21
===================

* 3.2.8 [[0e89312](https://github.com/applitools/eyes-cypress/commit/0e893122ff707a2cd4b4fcc02a32a57f63cb5752)]
* update readme with concurrency and note about exceptions [[2241cdf](https://github.com/applitools/eyes-cypress/commit/2241cdfbd8a4745627253ef9c9e8b191ca54e312)]

v3.2.7 / 2018-10-16
===================

* 3.2.7 [[71ed260](https://github.com/applitools/eyes-cypress/commit/71ed2606d5eb773751172bee6a0e6911b6ac8ccd)]

v3.2.6 / 2018-10-16
===================

* 3.2.6 [[e4732ba](https://github.com/applitools/eyes-cypress/commit/e4732bae889b9c21ea54f10f951a2a80e3ef4d6b)]
* add default concurrency [[9ef30b7](https://github.com/applitools/eyes-cypress/commit/9ef30b7902e1b8ae6791b8f72a8c22cfab80cfe6)]
* remove domCapture argument [[3c038e7](https://github.com/applitools/eyes-cypress/commit/3c038e7efe8e03cec3dbb59723516e7d280c9ea9)]

v3.2.5 / 2018-10-16
===================

* 3.2.5 [[10d2f7d](https://github.com/applitools/eyes-cypress/commit/10d2f7de94a826b441358bc3d7351245cc6d8a3a)]
* remove dom-capture dependency [[9cc5111](https://github.com/applitools/eyes-cypress/commit/9cc5111f19166d510b32d0c7a97a4b9fc1f6a436)]

v3.2.4 / 2018-10-16
===================

* 3.2.4 [[e8ca112](https://github.com/applitools/eyes-cypress/commit/e8ca112de5c6418f6a8f067ad7298f4562dd9b64)]
* update packages to fix eyes.sdk.core to 2.0.1 [[7d23786](https://github.com/applitools/eyes-cypress/commit/7d237861a0aa8387aa0851cf6a1d8a1c1fc515ab)]

v3.2.3 / 2018-10-15
===================

* 3.2.3 [[c4589b3](https://github.com/applitools/eyes-cypress/commit/c4589b31940d1aa258d4acd04e6199dc17dbb403)]
* update packages to fix eyes.sdk.core on 2.0 [[c345719](https://github.com/applitools/eyes-cypress/commit/c3457194f8bb7e0b4768533f7592d7caac229862)]
* refactor server for testability [[faa41b0](https://github.com/applitools/eyes-cypress/commit/faa41b0f34238bcafe1f561f7d4a9bef5f1c72ae)]
* support sendDom, refactor eyesCheckWindow, and add tests [[1173a5e](https://github.com/applitools/eyes-cypress/commit/1173a5e81eaafe0b1dc80626f59459585452cb28)]

v3.2.2 / 2018-10-14
===================

* 3.2.2 [[2832f0a](https://github.com/applitools/eyes-cypress/commit/2832f0a14f08d96c92aaa2e57120bcbfd37b6c04)]
* update packages to get a fix for resource missing content bug [[68aa417](https://github.com/applitools/eyes-cypress/commit/68aa417283441047e74711dec71c492b2fd877f7)]

v3.2.1 / 2018-10-10
===================

* 3.2.1 [[cbdd67d](https://github.com/applitools/eyes-cypress/commit/cbdd67d36113ed28ea0f581c94c2a899dec0a653)]

v3.2.0 / 2018-10-10
===================

* 3.2.0 [[72ce442](https://github.com/applitools/eyes-cypress/commit/72ce4427724f445fda9b3d5c69497a70418c6d45)]
* iframe support [[2dd6a53](https://github.com/applitools/eyes-cypress/commit/2dd6a5377c98286bc67e7eb8986ba4928b7c3cbf)]
* Merge remote-tracking branch 'amir/master' [[9d7a02f](https://github.com/applitools/eyes-cypress/commit/9d7a02fae5688e7731091254a6c0cc53ee5e8994)]
* add allBlobs support [[287caf1](https://github.com/applitools/eyes-cypress/commit/287caf1fb13dc0887369a532e55e59d8be473944)]
* add iframe integration play [[e14eab5](https://github.com/applitools/eyes-cypress/commit/e14eab595c5b1a89e3b7f207b86d03056367af34)]
* add iframe support [[41232e2](https://github.com/applitools/eyes-cypress/commit/41232e24ca1b5f60454589d2eb8d84b8fb52c38c)]

v3.1.1 / 2018-10-02
===================

* 3.1.1 [[98439ba](https://github.com/applitools/eyes-cypress/commit/98439ba340ac16eca8a1d1f6bdd1997c13fffbd0)]

v3.1.0 / 2018-10-02
===================

* 3.1.0 [[c48501b](https://github.com/applitools/eyes-cypress/commit/c48501bbd455e00d5cbd6572cdb712cb8ef79d84)]
* update visual-grid-client to support floating regions [[d032478](https://github.com/applitools/eyes-cypress/commit/d032478dee89ddca3c010b52d706aa4c3afe29fe)]

v3.0.25 / 2018-10-02
====================

* 3.0.25 [[d4e3060](https://github.com/applitools/eyes-cypress/commit/d4e3060077f93667fd2d77d667c22852a742fb52)]
* update visual-grid-client to not fail on fetchResource [[4689f94](https://github.com/applitools/eyes-cypress/commit/4689f941425304d388fc8e3f0c465beae5a74247)]

v3.0.24 / 2018-09-30
====================

* 3.0.24 [[15e1504](https://github.com/applitools/eyes-cypress/commit/15e15043df4bba616eeb49b46f43f3d532ec4152)]
* update packages [[823cb75](https://github.com/applitools/eyes-cypress/commit/823cb752e4736d5596da23c58dc521eba3c9c57f)]

v3.0.23 / 2018-09-25
====================

* 3.0.23 [[db76e67](https://github.com/applitools/eyes-cypress/commit/db76e673ea892f9e3210173f87070172ad343ab3)]
* update readme to use applitools.config.js instead of eyes.json [[ef9ab96](https://github.com/applitools/eyes-cypress/commit/ef9ab969746caf60e6332fb8a142ba96a70e7417)]
* update npm packages [[e05e1b0](https://github.com/applitools/eyes-cypress/commit/e05e1b0efe1a3e91974cecc7bd2b4b8d33666f00)]

v3.0.22 / 2018-09-25
====================

* 3.0.22 [[3f9e834](https://github.com/applitools/eyes-cypress/commit/3f9e834ab20992f1ee65d4c984ee6b5a698c0b05)]
* update visual-grid-client to v5 to simplify config [[85821d9](https://github.com/applitools/eyes-cypress/commit/85821d913806cad84688fbd32e3ac3583e8275ca)]

v3.0.21 / 2018-09-20
====================

* 3.0.21 [[9b918a5](https://github.com/applitools/eyes-cypress/commit/9b918a5a6f558588507af504402fff770b789cf3)]
* update readme with custom props [[a419219](https://github.com/applitools/eyes-cypress/commit/a4192193cf7f65d095294cdec4d8226dcc21ca50)]

v3.0.20 / 2018-09-20
====================

* 3.0.20 [[ad97576](https://github.com/applitools/eyes-cypress/commit/ad97576317f72db75d92f201ba742aaac7a3ef58)]
* update visual-grid-client to get fetch improvements [[c9d52e0](https://github.com/applitools/eyes-cypress/commit/c9d52e0ba92992a6674c3dcfea2bf21889120198)]

v3.0.19 / 2018-09-17
====================

* 3.0.19 [[dc68439](https://github.com/applitools/eyes-cypress/commit/dc6843973fd709a7513e3d2e3df7784e5abb7f14)]
* update visual-grid-client to 4.3.7 to support dom snapshot in server [[cd2a3c3](https://github.com/applitools/eyes-cypress/commit/cd2a3c3f727bdb47118120407f96b676a9cd3aef)]

v3.0.18 / 2018-09-16
====================

* 3.0.18 [[dd1e30d](https://github.com/applitools/eyes-cypress/commit/dd1e30d0309a423249314e62075cc4e1154651ce)]
* update visual-grid-client to bring back dom [[0ff88e6](https://github.com/applitools/eyes-cypress/commit/0ff88e6f2f00fa1d5ae4a00fa473f8302d296d4f)]

v3.0.17 / 2018-09-16
====================

* 3.0.17 [[db1dc18](https://github.com/applitools/eyes-cypress/commit/db1dc183450caf5e3635108dd4f26c4208b437fb)]
* update visual-grid-client to fix isDisabled and write some tests [[86addc5](https://github.com/applitools/eyes-cypress/commit/86addc5a0b0cebac6ba98cfa878cb0dcbe897192)]
* skip failed play test [[39b32d9](https://github.com/applitools/eyes-cypress/commit/39b32d9afe7d1c8c321ef8e580bbe1d590466a61)]

v3.0.16 / 2018-09-08
====================

* 3.0.16 [[24c532f](https://github.com/applitools/eyes-cypress/commit/24c532fa8105dfa8dbde39ecc34d99d78c7fda18)]
* update readme [[10e3c74](https://github.com/applitools/eyes-cypress/commit/10e3c747c6f74b29ae876f6318c07c6c8df491a2)]

v3.0.15 / 2018-09-08
====================

* 3.0.15 [[cefafe4](https://github.com/applitools/eyes-cypress/commit/cefafe49ea7f160f8bdc990189bdae7717f0a9ce)]
* better error handling [[3db05ad](https://github.com/applitools/eyes-cypress/commit/3db05adac31f46db2603ae80d91f5beded9d8704)]
* update visual-grid-client to 4.3.2 [[5b61500](https://github.com/applitools/eyes-cypress/commit/5b61500d76fcd0b6025e909428b6a75add4d4468)]
* run usual tests on cypress:run script [[77df33c](https://github.com/applitools/eyes-cypress/commit/77df33c98265b019164baf1bf3c0ee51f4f0c4a1)]
* reset running tests on batchStart [[ec7929c](https://github.com/applitools/eyes-cypress/commit/ec7929cf69abbdec5e99b34f247f3608febc2944)]
* move timeout msg out of polling handler [[a3ce458](https://github.com/applitools/eyes-cypress/commit/a3ce45880da1888708b80b4341d6065f33b0e0df)]
* add timeout for extracting dom data [[2eaa9e9](https://github.com/applitools/eyes-cypress/commit/2eaa9e9d9e9fc3b65eed177af18e57467e5fcd29)]
* move files from src/cypress to src/ [[221c49c](https://github.com/applitools/eyes-cypress/commit/221c49c8432123ac7e992b7080cc55b1bc83730d)]

v3.0.14 / 2018-09-04
====================

* 3.0.14 [[a4d2b2d](https://github.com/applitools/eyes-cypress/commit/a4d2b2dbfd74350f6c35822e294a4206ab8bf8a2)]
* fix dom capture [[0a88cab](https://github.com/applitools/eyes-cypress/commit/0a88cab5812de2320bd923a244df0cceaf9bdd46)]
* add device emulation to readme [[bea2fbd](https://github.com/applitools/eyes-cypress/commit/bea2fbd9d2d5d1c6a9abb9004ed7864e2398c975)]

v3.0.13 / 2018-08-29
====================

* 3.0.13 [[5f022eb](https://github.com/applitools/eyes-cypress/commit/5f022ebed3ff7932d1497bcd4a7daf52895fd768)]
* refactor server and pluginExport [[eced27f](https://github.com/applitools/eyes-cypress/commit/eced27feefb03fbd07ee17ce8a94be75fee40437)]

v3.0.12 / 2018-08-27
====================

* 3.0.12 [[f712cc0](https://github.com/applitools/eyes-cypress/commit/f712cc0774ad4145e4b3291656b97a394da29e53)]
* update visual-grid-client to log errors [[fce29a5](https://github.com/applitools/eyes-cypress/commit/fce29a5302dd9f8468d0b8c594d01240f56b13f1)]

v3.0.11 / 2018-08-27
====================

* 3.0.11 [[2e046bd](https://github.com/applitools/eyes-cypress/commit/2e046bd91d4c0456ffa7890bcea5e483733eefe8)]
* fix tests [[e75a6a6](https://github.com/applitools/eyes-cypress/commit/e75a6a631391bea1b05a997350f59858993b668b)]

v3.0.10 / 2018-08-27
====================

* 3.0.10 [[375275d](https://github.com/applitools/eyes-cypress/commit/375275da8daeec0f952314d7c2baa1eee3872437)]
* fix error in putResource and add tests for app [[57b769d](https://github.com/applitools/eyes-cypress/commit/57b769dcbb28a67e80ef9ce3a2fab972305a00dd)]

v3.0.9 / 2018-08-27
===================

* 3.0.9 [[dd7f7b9](https://github.com/applitools/eyes-cypress/commit/dd7f7b9c9f0c17dc8f93861386da47e560aa028d)]
* update visual-grid-client to fix node object spread issue [[4df1b9d](https://github.com/applitools/eyes-cypress/commit/4df1b9d4439cc0cd3f3e3ddf28e5c7a280242749)]

v3.0.8 / 2018-08-22
===================

* 3.0.8 [[e1404c5](https://github.com/applitools/eyes-cypress/commit/e1404c5a76b4189000e119dac2af18cf464cdc56)]
* update visual-grid-client to 4.1.3 [[5f014e0](https://github.com/applitools/eyes-cypress/commit/5f014e089c3f893c404bfdd26381067e5845a022)]

v3.0.7 / 2018-08-22
===================

* 3.0.7 [[2e6d5d9](https://github.com/applitools/eyes-cypress/commit/2e6d5d99f4c2d3d86f35cc9e65831e151fb6b0a4)]
* change rendering-grid-client to visual-grid-client v4.1.2 [[fbe4f9e](https://github.com/applitools/eyes-cypress/commit/fbe4f9e6a35ecf869de18a1aef2ff4ef3785545a)]
* npm version patch on prepublishOnly [[7662c10](https://github.com/applitools/eyes-cypress/commit/7662c10c98182da09de665de1a5023c86718d67b)]
* update workspace [[1e8f06b](https://github.com/applitools/eyes-cypress/commit/1e8f06b493ae36f099bd20c3d9d60a06f37c11ff)]
* 3.0.6 [[e67cd43](https://github.com/applitools/eyes-cypress/commit/e67cd43173a869b63e08c95f74c1c086a56a6c6b)]
* update readme [[33d2b02](https://github.com/applitools/eyes-cypress/commit/33d2b0283441c838864d3e233ab20e22fc01db93)]
* 3.0.5 [[a9e0e8f](https://github.com/applitools/eyes-cypress/commit/a9e0e8f2597c8d9e31b7d8494a7dbd2af9ff3744)]
* fix tests [[8335bc3](https://github.com/applitools/eyes-cypress/commit/8335bc3d0ff18d2b725b54ab117383510952eacf)]
* update readme with best practice and remove plugin port [[a68209e](https://github.com/applitools/eyes-cypress/commit/a68209ec012e7f916714f23f9e38efa029044ed9)]
* 3.0.4 [[51b3910](https://github.com/applitools/eyes-cypress/commit/51b3910543ba7681b7f7ce1b6a10015ec26527e1)]
* abort unclosed tests [[9a9b2e2](https://github.com/applitools/eyes-cypress/commit/9a9b2e2fddf81826af6d033b582a55a17e5b00a3)]
* where did this timeout come from? [[e55de94](https://github.com/applitools/eyes-cypress/commit/e55de94a9e5e45896c147516bbfafb9bc5d01dcb)]
* 3.0.3 [[1575225](https://github.com/applitools/eyes-cypress/commit/15752258e837e6c4499387f5d35d93cee4a67db8)]
* npm run cypress:run [[85fc199](https://github.com/applitools/eyes-cypress/commit/85fc199b5be97bb3ea889736cbf0236f6fd5c121)]
* use waitForTestResults inside batchEnd handler [[5e177c8](https://github.com/applitools/eyes-cypress/commit/5e177c87a973f99b732970baec40e8c336865e48)]
* 3.0.2 [[f156ade](https://github.com/applitools/eyes-cypress/commit/f156adebc386ffcc7158db65f66393dcaaa7c8ab)]
* batchEnd support now stable [[c742fd5](https://github.com/applitools/eyes-cypress/commit/c742fd53199fe10a32cfae51c2046d2b3d6be19e)]
* error in openEyes should cause close to do nothing [[3521d9e](https://github.com/applitools/eyes-cypress/commit/3521d9e2e8aff9f9fc337c635caa8ea1af55aa91)]

v3.0.1 / 2018-08-09
===================

* 3.0.1 [[86bd53d](https://github.com/applitools/eyes-cypress/commit/86bd53ddff57888739529836611fffc60efa1544)]
* 3.0.0 [[c38e385](https://github.com/applitools/eyes-cypress/commit/c38e385e7d7de1a9ab6b50a7e71082d0d55c5df5)]
* add batchStart and batchEnd and move config to rendering-grid-client [[810d3e7](https://github.com/applitools/eyes-cypress/commit/810d3e75a33a03d1c66f217ca79c82c696c68406)]

v2.1.6 / 2018-08-08
===================

* 2.1.6 [[e6ab427](https://github.com/applitools/eyes-cypress/commit/e6ab4279bb318b47f1e9c7d1bba75f2235825c65)]
* update rendering-grid-client to 2.0.6 [[5b51c99](https://github.com/applitools/eyes-cypress/commit/5b51c994da80d5ec11e44bf463b4e04c2c0ab29b)]

v2.1.5 / 2018-08-08
===================

* 2.1.5 [[890b630](https://github.com/applitools/eyes-cypress/commit/890b630327a5e5e1235d25208ff7fa50c5194b90)]
* playing with tests [[dfc82cb](https://github.com/applitools/eyes-cypress/commit/dfc82cb9bbd16293151ffc878cf827fb0708cf8a)]
* eslint config [[b44a370](https://github.com/applitools/eyes-cypress/commit/b44a370985957f10261c129e8508773fa8716b89)]

v2.1.4 / 2018-08-07
===================

* 2.1.4 [[5fc16f5](https://github.com/applitools/eyes-cypress/commit/5fc16f538b302e4a6d9a2613243b0e5cc12a6ced)]
* update rendering-grid-client to 2.0.5 [[be92c07](https://github.com/applitools/eyes-cypress/commit/be92c07640b4b92225ebc0452936199e094bbd53)]

v2.1.3 / 2018-08-07
===================

* 2.1.3 [[d513cf2](https://github.com/applitools/eyes-cypress/commit/d513cf2ab34a282bca3f3a83a11c06cc8fdf1bf3)]
* update rendering-grid-client to 2.0.4 [[03d05cf](https://github.com/applitools/eyes-cypress/commit/03d05cf63a20ea0e18696840c870c593e9c05158)]

v2.1.2 / 2018-08-07
===================

* 2.1.2 [[5af275e](https://github.com/applitools/eyes-cypress/commit/5af275e750dccf71978ba57fa9519b9f83ac08cf)]
* add testName and browser name to readme [[b5d8bd4](https://github.com/applitools/eyes-cypress/commit/b5d8bd445864d2fd59ad4ea19ae050b0057bde55)]
* before hook [[69f0458](https://github.com/applitools/eyes-cypress/commit/69f0458474a22349d034addeae7cf01526b9cd82)]
* eslint warning [[23c8984](https://github.com/applitools/eyes-cypress/commit/23c8984650902921ce309b25fea06062c47b3182)]
* add ignore, region and selector to readme [[2b7dc43](https://github.com/applitools/eyes-cypress/commit/2b7dc4346b157b52a84c85f2cbbb3ec3f3841287)]
* add ignore to checkWindow [[b0aca62](https://github.com/applitools/eyes-cypress/commit/b0aca62039b6184f08f642c9d2c494cf0b260138)]
* add simple script [[1418bf7](https://github.com/applitools/eyes-cypress/commit/1418bf7a3ae777aa75f78526deef2b9d52dd113a)]
* automatically provide testName [[21e2ede](https://github.com/applitools/eyes-cypress/commit/21e2edee649af210ae293c29f9d9531d2ddbd5e1)]
* fix audit issues [[5787947](https://github.com/applitools/eyes-cypress/commit/5787947296f1c2a86a43155b1eb3b8f9454b6297)]
* relative paths in workspace [[7f4224d](https://github.com/applitools/eyes-cypress/commit/7f4224d771202bc5e6cc43a07b9343adeeb1d631)]
* remove console logs [[99b3fee](https://github.com/applitools/eyes-cypress/commit/99b3feef275d47b090a5d8f5baa229223fdd3bd9)]
* start a new batch before all tests run [[c844255](https://github.com/applitools/eyes-cypress/commit/c844255e3f78441f1ac394bfba9fde3372f3f127)]

v2.1.1 / 2018-08-06
===================

* 2.1.1 [[08147fa](https://github.com/applitools/eyes-cypress/commit/08147fa075a8a1a970b775fd07f2584f37e172a1)]
* update rendering-grid-client to 2.0.2 [[ad128b7](https://github.com/applitools/eyes-cypress/commit/ad128b71bada6d4c83f4987cef3940333efdde00)]

v2.1.0 / 2018-08-06
===================

* 2.1.0 [[e3c40d2](https://github.com/applitools/eyes-cypress/commit/e3c40d28d5510f58970ded29ecfee77e23d6080e)]
* fix test [[d581548](https://github.com/applitools/eyes-cypress/commit/d5815489dc4ba49e385df98ae6c73293a7f93c65)]
* Merge branch 'scripthooks' [[7db45bb](https://github.com/applitools/eyes-cypress/commit/7db45bbdcfcf99c9507b175b2802990af9a1a035)]
* Merge branch 'region' [[32402f7](https://github.com/applitools/eyes-cypress/commit/32402f71a88b78e56cbc2eba147de657d34e3503)]
* update rendering-grid-client to 1.1.13 to support authenticated resources [[9fe7f21](https://github.com/applitools/eyes-cypress/commit/9fe7f213bf71c95c5d287051823b1b054312df79)]
* fix isCommands defined [[04f16e7](https://github.com/applitools/eyes-cypress/commit/04f16e7ebf9c761d7c42388d3f0b0fec3b06df5d)]
* support region and selector in checkWindow [[be0a640](https://github.com/applitools/eyes-cypress/commit/be0a640f32c9c684f2bf851855b367b72f71ec50)]
* add support for scriptHooks [[74bcd42](https://github.com/applitools/eyes-cypress/commit/74bcd42551570ac2c0277b8534aecfd179944276)]

v2.0.0 / 2018-08-01
===================

* 2.0.0 [[06853c7](https://github.com/applitools/eyes-cypress/commit/06853c7728c37f7d1514ee7d29aaea3b85e7e12c)]
* automatically set eyesPort in cypress config [[918d96e](https://github.com/applitools/eyes-cypress/commit/918d96ee731c8f5b791cd6ca9507fdaa7431516d)]
* add branchName to readme [[9902187](https://github.com/applitools/eyes-cypress/commit/99021874b453e777cb9fa200aed54831a46e5c13)]
* add serverUrl and testName to configParams [[ed19c78](https://github.com/applitools/eyes-cypress/commit/ed19c78fa9085277ca433465e57ea1f9d32a5885)]
* get new batch on browser launch (public API break) [[34fde8a](https://github.com/applitools/eyes-cypress/commit/34fde8a5101f274cee679f269db353278a02558c)]

v1.5.25 / 2018-08-06
====================

* 1.5.25 [[e56af74](https://github.com/applitools/eyes-cypress/commit/e56af74fb382895b73c3b8eae2ca2d48eecf6fb2)]
* fix putResource [[f7cd61e](https://github.com/applitools/eyes-cypress/commit/f7cd61e7b305de0cdcd2889da9cf28fcdddb3da8)]

v1.5.24 / 2018-07-31
====================

* 1.5.24 [[1c2f2b8](https://github.com/applitools/eyes-cypress/commit/1c2f2b8b9bcf2acb90073dfa38f24590bb608f98)]
* update rendering grid client to 1.1.11 [[dbd128b](https://github.com/applitools/eyes-cypress/commit/dbd128b05cc28651df11c6adc8fa265dcd7d883c)]
* add resources page to playground [[e2715f1](https://github.com/applitools/eyes-cypress/commit/e2715f14ef76fb41bd69a1ac2f5277283b646608)]

v1.5.23 / 2018-07-29
====================

* 1.5.23 [[ec20290](https://github.com/applitools/eyes-cypress/commit/ec20290d72a975231e1db454a04c7b8d0d910016)]
* update rendering-grid-client to 1.1.10 [[c0fbc66](https://github.com/applitools/eyes-cypress/commit/c0fbc66780b3b3834fb53326fc64771b6e96609e)]

v1.5.22 / 2018-07-29
====================

* 1.5.22 [[b126f72](https://github.com/applitools/eyes-cypress/commit/b126f72cb9b30e4cb34b3c34558e4cff62dd7868)]
* nullify close and checkWindow after close has ended [[9a26211](https://github.com/applitools/eyes-cypress/commit/9a26211366a8cb1afbb1c8a6d60273c83fc435ca)]

v1.5.21 / 2018-07-26
====================

* 1.5.21 [[df07167](https://github.com/applitools/eyes-cypress/commit/df07167c135ebf78726f30caa6bd13fc14412644)]
* pack test leaves no tracks [[9f371c0](https://github.com/applitools/eyes-cypress/commit/9f371c00987e4962f6fefbab95db485bf7f36188)]
* split express app from server, and add server error log [[4c3ef8c](https://github.com/applitools/eyes-cypress/commit/4c3ef8c7f92fe220dde85eea71ec49c6a5d6624a)]
* fix eslint [[293fed9](https://github.com/applitools/eyes-cypress/commit/293fed96d3cc9a136f804742c1f1777b72a7e380)]
* split interactive cypress tests to files [[e1214dc](https://github.com/applitools/eyes-cypress/commit/e1214dc5c7dee3dea4537f0379db7591a9843bf8)]

v1.5.20 / 2018-07-22
====================

* 1.5.20 [[3a9a749](https://github.com/applitools/eyes-cypress/commit/3a9a749e11e5f7ae7db61d172a541063b8f96297)]
* update rendering grid version to support branchName [[d8c4054](https://github.com/applitools/eyes-cypress/commit/d8c40541232f5c01d0a115c5232912579de646af)]
* add meta tag to html fixture [[98ed227](https://github.com/applitools/eyes-cypress/commit/98ed227415abcc55caf2fd6caa70133c490f4131)]

v1.5.19 / 2018-07-19
====================

* 1.5.19 [[6103923](https://github.com/applitools/eyes-cypress/commit/6103923c521106ca03f0c7c2d6d4347fa21afdca)]
* update rendering-grid-client to fix empty resource issue [[d2fbe9d](https://github.com/applitools/eyes-cypress/commit/d2fbe9dbebcd4f3d9fb6506f038194d93365ddba)]

v1.5.18 / 2018-07-19
====================

* 1.5.18 [[7017c0e](https://github.com/applitools/eyes-cypress/commit/7017c0ed23b079392e84291a0052d2a8605ef4d1)]
* update rendering-grid-client with render status error handling [[e9640e0](https://github.com/applitools/eyes-cypress/commit/e9640e0f7223a1583e449a625d4a1fce4209ee2c)]
* add big website test [[93c85a4](https://github.com/applitools/eyes-cypress/commit/93c85a4329ee09a5eed0acd04aabd0d6027c3cd0)]

v1.5.17 / 2018-07-18
====================

* 1.5.17 [[ce7fdd9](https://github.com/applitools/eyes-cypress/commit/ce7fdd927de019be616f9dc11e44a07a029a2c6d)]
* add serverUrl to readme [[37b8ef2](https://github.com/applitools/eyes-cypress/commit/37b8ef2aa1a5c692fbc8d96babce0f301a9da61d)]

v1.5.16 / 2018-07-18
====================

* 1.5.16 [[925eaf5](https://github.com/applitools/eyes-cypress/commit/925eaf5f4229f4888cff82b515ada88870163f15)]
* update rendering-grid-client to 1.1.5 [[4d22e54](https://github.com/applitools/eyes-cypress/commit/4d22e541f7da1b37f0779b0c1ea36dca732d089f)]
* npm dedupe [[2326068](https://github.com/applitools/eyes-cypress/commit/23260680d13619e870e68a5cb050c8ab99a49545)]

v1.5.15 / 2018-07-16
====================

* 1.5.15 [[190c0a4](https://github.com/applitools/eyes-cypress/commit/190c0a4dacb95033c83cbbd7e45c7da15ca7d80b)]
* pass url in checkWindow instead of openEyes [[80b441e](https://github.com/applitools/eyes-cypress/commit/80b441e7f00f2cc9cda970de3516853257ccebcd)]

v1.5.14 / 2018-07-16
====================

* 1.5.14 [[c5dfa8b](https://github.com/applitools/eyes-cypress/commit/c5dfa8bd404e1ab80608f2c4e18eb36a7588cf93)]
* update rendering grid client to handle unauthorized access [[a55bc18](https://github.com/applitools/eyes-cypress/commit/a55bc185c0aca98daca0f7b2fb6c19399c1bedf6)]
* add info on match levels in readme [[3bdc6b2](https://github.com/applitools/eyes-cypress/commit/3bdc6b257a8dad13fa83fb181e7c1953631d9ec7)]
* fixed version for body-parser to be the same as in express [[a9e19f7](https://github.com/applitools/eyes-cypress/commit/a9e19f7820413f4db1ed7a2aa16d3106211936cd)]
* npm update [[b2a7a9b](https://github.com/applitools/eyes-cypress/commit/b2a7a9b919c12cf3ca7563fe925de8b05edfff66)]
* add configuration for wrappers [[6302891](https://github.com/applitools/eyes-cypress/commit/63028913af46434315cb32d23d39b0bd22ddc299)]
* send dom capture in checkWindow [[299d9aa](https://github.com/applitools/eyes-cypress/commit/299d9aa292cb83412da88cacd3d02d06f24fc26d)]

v1.5.13 / 2018-07-12
====================

* 1.5.13 [[2d1fd5c](https://github.com/applitools/eyes-cypress/commit/2d1fd5cbaeafe02c93d0e30b5aa9c21cc14feccf)]
* bring back missing css for tests [[7d24195](https://github.com/applitools/eyes-cypress/commit/7d241959add3e7fcc02917d2fc1ab262ed8d233e)]
* update @applitools/rendering-grid-client to 1.0.5 [[e246c19](https://github.com/applitools/eyes-cypress/commit/e246c19a5ae23d932f17df128ed9d74dc75f6ea2)]
* remove unnecessary dependencies [[713be12](https://github.com/applitools/eyes-cypress/commit/713be12a53ceb057e2a902aeffbbdff07a672d66)]
* remove lodash from dependencies [[40732d0](https://github.com/applitools/eyes-cypress/commit/40732d050a1188bfb500df920c5520faa0505590)]
* create workspace with rendering-grid-client [[a806022](https://github.com/applitools/eyes-cypress/commit/a8060227d389b820c1578c8518cc891be8b3a51e)]

v1.5.12 / 2018-07-11
====================

* 1.5.12 [[48de82f](https://github.com/applitools/eyes-cypress/commit/48de82f3e45b2dde7d8a4180ba39b08cc746bb61)]
* remove unused files [[73c5e68](https://github.com/applitools/eyes-cypress/commit/73c5e688c24265e38d6b94350c0fe60d041c84e3)]
* use @applitools/rendering-grid-client [[53c6a8e](https://github.com/applitools/eyes-cypress/commit/53c6a8efaa026caa4b89db60d31f56accdd39b3b)]
* change internal api's to "make..." [[df012ae](https://github.com/applitools/eyes-cypress/commit/df012aebbbfd9ce6af16f7355bc4772f4f9226fa)]
* fix tests and eslint [[d9afc7c](https://github.com/applitools/eyes-cypress/commit/d9afc7ca9b523f20d09e7698a9f3f2779d202101)]

v1.5.11 / 2018-07-10
====================

* 1.5.11 [[340a5f4](https://github.com/applitools/eyes-cypress/commit/340a5f458b50002b0793cec8a37fefc31a4088f5)]
* remove unused file [[8fde894](https://github.com/applitools/eyes-cypress/commit/8fde8942c50b1d58863cea802194d9105d954395)]
* remove .only [[8c41c4f](https://github.com/applitools/eyes-cypress/commit/8c41c4f9a549bf667eb9bc81680f853f2686eda6)]

v1.5.10 / 2018-07-10
====================

* 1.5.10 [[df5d5c6](https://github.com/applitools/eyes-cypress/commit/df5d5c68f120dbfd0aa7bf0c994689284c8893b2)]
* extract css resources from style attributes [[b627afc](https://github.com/applitools/eyes-cypress/commit/b627afc1a508dceb043fed37af95ec33f8921558)]
* handle some TODOs [[dd6d878](https://github.com/applitools/eyes-cypress/commit/dd6d8782e6ed4a2496934445cf20b662bf725978)]
* support multiple urls per css rule [[1ebae9a](https://github.com/applitools/eyes-cypress/commit/1ebae9ac4a37d15b66bab6a31720c4ba3655e12c)]

v1.5.9 / 2018-07-09
===================

* 1.5.9 [[2e52d44](https://github.com/applitools/eyes-cypress/commit/2e52d44a9031105a841e03ad205995d040720d8f)]
* add description of setup script [[9a77dc1](https://github.com/applitools/eyes-cypress/commit/9a77dc1cc0987e207c6d3e0f873e31be9cac8e57)]

v1.5.8 / 2018-07-09
===================

* 1.5.8 [[0f63feb](https://github.com/applitools/eyes-cypress/commit/0f63feb9cf37e0e63576cbed39ce395ec8d95671)]
* support missing content-type on resources [[88dc019](https://github.com/applitools/eyes-cypress/commit/88dc0192d16779c4bccfb99447f78c2a5577a011)]
* remove .only from tests [[35f2d39](https://github.com/applitools/eyes-cypress/commit/35f2d392ccf1acc481ed5f247862503342c3945d)]

v1.5.7 / 2018-07-09
===================

* 1.5.7 [[fdc2e45](https://github.com/applitools/eyes-cypress/commit/fdc2e45365c369e3828c829e50efd795912c5794)]
* eyes-setup script adds also commands import [[f0c751a](https://github.com/applitools/eyes-cypress/commit/f0c751a6546d3271b79067017c43d4fdae987cde)]
* eyes setup script adds code to plugins file [[611b9fe](https://github.com/applitools/eyes-cypress/commit/611b9fe6e070fbe5022fc9679c298753eddba562)]

v1.5.6 / 2018-07-09
===================

* 1.5.6 [[4b227e2](https://github.com/applitools/eyes-cypress/commit/4b227e22dc04992a9a6d1900fcb7dcab26470948)]
* extract resources from @media rules [[bed3a13](https://github.com/applitools/eyes-cypress/commit/bed3a13072563c4c4307fea504a61bc67db02ed0)]

v1.5.5 / 2018-07-09
===================

* 1.5.5 [[d39e7e6](https://github.com/applitools/eyes-cypress/commit/d39e7e66a9ec65ad9553b609a9d498911a35127f)]
* readme update [[45be5cb](https://github.com/applitools/eyes-cypress/commit/45be5cb80bacb8e52e0f362b36974cb4ba5e7cfb)]
* fixed another log hole [[71c2224](https://github.com/applitools/eyes-cypress/commit/71c222444c209542663d68535bf300b09cb9c858)]

v1.5.4 / 2018-07-08
===================

* 1.5.4 [[d0c1b66](https://github.com/applitools/eyes-cypress/commit/d0c1b66149c7a7750085b441ca6c44c4fe6b5095)]
* avoid logs entirely when not in dev mode [[54f460b](https://github.com/applitools/eyes-cypress/commit/54f460be39f597a287867d72d2b322065e4b107c)]

v1.5.3 / 2018-07-08
===================

* 1.5.3 [[1e5d75f](https://github.com/applitools/eyes-cypress/commit/1e5d75f71149963f461ebb2ed2979da8340ebcd3)]
* avoid logs when showLogs is falsy [[ffad3c3](https://github.com/applitools/eyes-cypress/commit/ffad3c33bdd2457d8e0216711a531588bf365f38)]

v1.5.2 / 2018-07-08
===================

* 1.5.2 [[be5cabe](https://github.com/applitools/eyes-cypress/commit/be5cabed676a5d55a0b7aa76568b61c7039bdd28)]
* typo [[6c56905](https://github.com/applitools/eyes-cypress/commit/6c56905b245796e281ef0dc1447eca933110d1e6)]

v1.5.1 / 2018-07-08
===================

* 1.5.1 [[06aecea](https://github.com/applitools/eyes-cypress/commit/06aecea3a6cb2e3a9aab3c1e84848eed6952c598)]
* readme feedback [[1f5bff5](https://github.com/applitools/eyes-cypress/commit/1f5bff58b317dd3cb2b807e778e7a3ec4afbe5e2)]
* handle uppercase urls [[60453da](https://github.com/applitools/eyes-cypress/commit/60453dab48a39cb01b4fd95825a6d49009b26ff6)]
* add git repo to package.json [[89c8a2d](https://github.com/applitools/eyes-cypress/commit/89c8a2d59266b8c9f968ec3b8ba3a48e69b4f57d)]
* handle crash errors [[a80f380](https://github.com/applitools/eyes-cypress/commit/a80f3805000115c30d7ebe4ac2aa6c130c80f77e)]
* rearrange tests [[0ba8c0d](https://github.com/applitools/eyes-cypress/commit/0ba8c0db68fda368573eab1800fc229f8b16643f)]
* getAllResources should not keep global cache [[4f3551c](https://github.com/applitools/eyes-cypress/commit/4f3551cc586fe6e29dd0bcae065356c708fbcdcb)]
* assert that second render request doesn't return need-more-resources [[79c56ca](https://github.com/applitools/eyes-cypress/commit/79c56ca3990ca9e22dbb63b591e8aef4e2850106)]
* update eyes.sdk.core to 1.7.0 [[e9622e0](https://github.com/applitools/eyes-cypress/commit/e9622e0218be680c9b6151bb784c09b3bf9a7395)]
* small fixes [[49b44b6](https://github.com/applitools/eyes-cypress/commit/49b44b6c7755597e9d66502e821bf87046a11b40)]

v1.5.0 / 2018-07-05
===================

* 1.5.0 [[e9b1cde](https://github.com/applitools/eyes-cypress/commit/e9b1cdeadabecec51fd36e408888a3d23e5fe639)]
* support blob urls!!! [[b7cf9ee](https://github.com/applitools/eyes-cypress/commit/b7cf9eea8bb1064a79b12d4ed5315d9e083e06f0)]
* small change to handlers [[0ffdb87](https://github.com/applitools/eyes-cypress/commit/0ffdb8735745ff6bd92e331aab2ec99c6b60800f)]
* extract inner css resources in node instead of browser [[8ad564a](https://github.com/applitools/eyes-cypress/commit/8ad564a4b811dd86707bcb8ba4b7a0e0e39b9aca)]
* log runtime config [[67de282](https://github.com/applitools/eyes-cypress/commit/67de28236f3d40bcea343222f7eab596b4e07cda)]
* env var to show logs in tests [[025cc6e](https://github.com/applitools/eyes-cypress/commit/025cc6eefb6817b6cc4d99e702a0b582528c36c8)]
* add support for @supports rule [[3d2a1f7](https://github.com/applitools/eyes-cypress/commit/3d2a1f7366ce2881a161af78140c6d33acdef8b5)]
* better log [[aec0cbd](https://github.com/applitools/eyes-cypress/commit/aec0cbd539936826fe01db8a14df0d962a68b19c)]

v1.4.2 / 2018-07-02
===================

* 1.4.2 [[fa8908f](https://github.com/applitools/eyes-cypress/commit/fa8908f32e7d90232f1069af7a58028eb1864ff4)]
* config params [[387c893](https://github.com/applitools/eyes-cypress/commit/387c8938a0703f1875d6472d5f73781d0a6bc328)]

v1.4.1 / 2018-07-02
===================

* 1.4.1 [[1499905](https://github.com/applitools/eyes-cypress/commit/14999055b0ca586e1234eb8d8e29e86d2fa2ae91)]
* add 'use strict' to all files [[f8972bc](https://github.com/applitools/eyes-cypress/commit/f8972bc52a7f0db27a1ccdc9391d83f4f6726ba6)]
* handle batch name and id [[cf45374](https://github.com/applitools/eyes-cypress/commit/cf453748c1be6eb3e8b7242f910c41aee23f25e8)]
* small update [[51a07ab](https://github.com/applitools/eyes-cypress/commit/51a07ab70147a0b6e24757685b78a8b8b6574422)]
* shuffle tasks [[3d81a5d](https://github.com/applitools/eyes-cypress/commit/3d81a5dcd1ceec8f44a0e27d370cda34363ffc43)]
* expose sizeMode in commands [[842b3ff](https://github.com/applitools/eyes-cypress/commit/842b3ffb9da0ef0dc24fa11ba3289c1e62a41514)]

v1.4.0 / 2018-07-02
===================

* 1.4.0 [[ece68b2](https://github.com/applitools/eyes-cypress/commit/ece68b21cc3ea86f25addead434043326c230dcf)]
* optimize - call checkWindow before eyesClose [[d231223](https://github.com/applitools/eyes-cypress/commit/d231223511124b46cb2a6da162ec64c70a3f8980)]
* don't crash on unsupported protocols [[b846c85](https://github.com/applitools/eyes-cypress/commit/b846c85c462faefcdda36fae27f47372003c0150)]
* switch to npm [[cb26a00](https://github.com/applitools/eyes-cypress/commit/cb26a009dd833c0e2cb12f21f745c0a6a1e22e57)]

v1.3.7 / 2018-06-28
===================

* 1.3.7 [[0209ed6](https://github.com/applitools/eyes-cypress/commit/0209ed6cc3193240d6ec7193a91c08ae0c5bca8b)]
* support browser name in openEyes [[74f24ce](https://github.com/applitools/eyes-cypress/commit/74f24cee563ded526d5ce2d483fc2c3ce47b0197)]
* extract absolute urls from css, and handle parse exception [[27d2b0d](https://github.com/applitools/eyes-cypress/commit/27d2b0df082af699c5daa93f36e0d3181a3d9d4c)]
* change request implementation from 'fetch' to 'cy.request' [[a09ff9f](https://github.com/applitools/eyes-cypress/commit/a09ff9fda48da2d6053c76e3e15ccd6bfb093a63)]
* fix [[e6c7496](https://github.com/applitools/eyes-cypress/commit/e6c7496c0ed388bf13ed91895a7163bc45e3fa02)]
* support sizeMode argument in checkWindow [[a112faf](https://github.com/applitools/eyes-cypress/commit/a112faf6e88b92ce48632f8e6f33b6f90a9c3aa9)]
* markdown lint [[6025b8c](https://github.com/applitools/eyes-cypress/commit/6025b8ce4cd98ef6f6d6cfc6773bd8132be77898)]

v1.3.6 / 2018-06-27
===================

* 1.3.6 [[d725244](https://github.com/applitools/eyes-cypress/commit/d725244b93bfabafb2613c31bae798c589401d2b)]
* change close implementation to polling [[484f1b7](https://github.com/applitools/eyes-cypress/commit/484f1b778d051542c55ed29f8a389c9770da8a54)]
* fix path [[0e08b9f](https://github.com/applitools/eyes-cypress/commit/0e08b9f268d185132f61f20d6c790905e59dcfa2)]
* split plugin into modules [[461e32c](https://github.com/applitools/eyes-cypress/commit/461e32cfd8715bb090e175490abcc23071de2c73)]
* move plugin files [[64d77a4](https://github.com/applitools/eyes-cypress/commit/64d77a44a9ea313957e9ac72c0efb5db429fc0d9)]

v1.3.5 / 2018-06-25
===================

* 1.3.5 [[5427305](https://github.com/applitools/eyes-cypress/commit/5427305e0873dc02c27c971998db3526267bcd27)]
* change isVerbose to showLogs [[0ccbd12](https://github.com/applitools/eyes-cypress/commit/0ccbd127b8211eeacb463036287bd18c853935a9)]
* proper error messages [[5625644](https://github.com/applitools/eyes-cypress/commit/5625644b818d6e85d6a8004792d1212a482e1fbe)]
* improve readme [[9ba1bf9](https://github.com/applitools/eyes-cypress/commit/9ba1bf914507f34514276431f0b5f10cd055ebd4)]
* pad minutes and hours in debug folder name [[24574ba](https://github.com/applitools/eyes-cypress/commit/24574bae1a498336e4e4ffcdecd4e3bb8f113c68)]

v1.3.4 / 2018-06-19
===================

* 1.3.4 [[0cdfb4b](https://github.com/applitools/eyes-cypress/commit/0cdfb4ba649127f1172f1728646ab122f080c397)]
* move timeout to cy.eyesClose and document [[1b0e9f7](https://github.com/applitools/eyes-cypress/commit/1b0e9f7242723bada1682d17ffe751ae4869a7cb)]

v1.3.3 / 2018-06-19
===================

* 1.3.3 [[eb9ddc6](https://github.com/applitools/eyes-cypress/commit/eb9ddc6058139d353b663ff2e8b2e9f807d31e21)]
* slight change in readme [[cdbda9b](https://github.com/applitools/eyes-cypress/commit/cdbda9ba216aefd508d17d08c288d6de3a888860)]

v1.3.2 / 2018-06-19
===================

* 1.3.2 [[9a0e2de](https://github.com/applitools/eyes-cypress/commit/9a0e2de31f76f73619412fdb3e0e7fbeded52d11)]
* remove clause from readme [[2b9d06e](https://github.com/applitools/eyes-cypress/commit/2b9d06eb6690086fa99831917f62c790afa3324a)]

v1.3.1 / 2018-06-19
===================

* 1.3.1 [[fe7708d](https://github.com/applitools/eyes-cypress/commit/fe7708d2e076b4c3c269a8b23e5ebc14532906e9)]
* fix e2e test syntax [[6ad4bb1](https://github.com/applitools/eyes-cypress/commit/6ad4bb1f78b3861ad25bce6d6cc10e8f4e758438)]
* fix tests with new fakes [[853e730](https://github.com/applitools/eyes-cypress/commit/853e7307bd8046faa5b1450ee6ad5aa08827dd93)]
* shuffle tasks [[a9b0568](https://github.com/applitools/eyes-cypress/commit/a9b056833830681a90cac8a2eb0f65d1126c2109)]
* fix: send resources when need more resources [[be6679b](https://github.com/applitools/eyes-cypress/commit/be6679bdeb800db615ed31a8e83bbed1870e3ae8)]
* send 2 viewport sizes in e2e tests [[c52e3c0](https://github.com/applitools/eyes-cypress/commit/c52e3c082d8fc37c3db426d1932369b631c56297)]
* add example to readme [[e963d0f](https://github.com/applitools/eyes-cypress/commit/e963d0fe34d8fe93fd4ff4218f5a4d89dcf3c6ed)]
* support videos and fix tests [[56f2615](https://github.com/applitools/eyes-cypress/commit/56f26152175f1790313d7cc647d7f8054a43f458)]

v1.3.0 / 2018-06-18
===================

* 1.3.0 [[c5c50ad](https://github.com/applitools/eyes-cypress/commit/c5c50ad164fcbd14cee844499cb1b4ff15e8306e)]
* pass all user args to openEyes and support config file and env variables [[803700a](https://github.com/applitools/eyes-cypress/commit/803700a87a1731478f9dd44513f309f039f2589f)]
* save debug data to folder name with date [[e248e99](https://github.com/applitools/eyes-cypress/commit/e248e9999ad0309c65bf1552e6f23324bc2d54a4)]
* handle doctype when creating cdt [[737e7b4](https://github.com/applitools/eyes-cypress/commit/737e7b4cbab8c7120f449c1b93c48d73976fa336)]
* format test.cdt.json [[c7da09b](https://github.com/applitools/eyes-cypress/commit/c7da09bff6795099a16e41147d4cd2ff3b41ae1c)]
* handle render status timeout [[49fbf31](https://github.com/applitools/eyes-cypress/commit/49fbf319e17621aebd5ef0776253889e050a03cc)]
* update package version in fixture test app [[27786e1](https://github.com/applitools/eyes-cypress/commit/27786e1bcee4000f356d98546446b19d9cc5783c)]
* fix async errors in plugin test [[8617bb4](https://github.com/applitools/eyes-cypress/commit/8617bb4507645133bc057c7c92ac5a19bba3c884)]
* fix optimization [[2b81f10](https://github.com/applitools/eyes-cypress/commit/2b81f10132381b0e7f745e8af38815ea1ad227af)]

v1.2.5 / 2018-06-18
===================

* 1.2.5 [[fa09441](https://github.com/applitools/eyes-cypress/commit/fa094418a6d2272ec98ba928a2ecf08856c393c6)]
* slight optimization to get render info earlier [[2efc88b](https://github.com/applitools/eyes-cypress/commit/2efc88ba044732b332e0726e7cd74aed8eab3ef0)]
* ignore occasional test generated node_modules folder in eslint [[27a7c4e](https://github.com/applitools/eyes-cypress/commit/27a7c4e25f0e5054f572b6382491d5635f5d3941)]
* integration tests for batch and multiple viewport sizes [[83782d1](https://github.com/applitools/eyes-cypress/commit/83782d16e69d70fe02f0c0dd24b0afd557541906)]
* support multiple viewport sizes [[c345268](https://github.com/applitools/eyes-cypress/commit/c345268b10465bf4323031efa21b64215fcfefb3)]
* save more resources data when debugging [[1a9d8b0](https://github.com/applitools/eyes-cypress/commit/1a9d8b087a245b3373cee3bed846487c42d1803e)]

v1.2.4 / 2018-06-17
===================

* 1.2.4 [[d43fee6](https://github.com/applitools/eyes-cypress/commit/d43fee6de51c23607de221ac1e5f5909728380a4)]
* Merge branch 'extract_style_resources' [[f35074b](https://github.com/applitools/eyes-cypress/commit/f35074be497a3b0ee333426fad6e9237a8ce9f6d)]
* add .private to .gitignore [[1273fb5](https://github.com/applitools/eyes-cypress/commit/1273fb5b61498e243441a5de91ef939eb1747cbc)]
* yarn lock [[859b0e2](https://github.com/applitools/eyes-cypress/commit/859b0e2ed9fbedabbffc9dc379be8889344c3bd3)]
* rename getRenderStatus to waitForRenderedStatus [[d53c6a4](https://github.com/applitools/eyes-cypress/commit/d53c6a49d5688d613e2220970388a62f21953c44)]
* handle empty renderStatus (fix 400 error) [[4f8836d](https://github.com/applitools/eyes-cypress/commit/4f8836d26032cfde9f1a5d9960d63f4a9a76a67f)]
* fix test [[10596fe](https://github.com/applitools/eyes-cypress/commit/10596fe029a9a7108a514aba952e5c46b4cc3e4b)]
* ugly but working solution to fetching inner css resources with cache [[206ee4e](https://github.com/applitools/eyes-cypress/commit/206ee4ebcdb81cea7ab94e3452c3d751b85cea99)]
* fix lint issues [[14e203d](https://github.com/applitools/eyes-cypress/commit/14e203d15c7b163bbad40b38f3dbe4743605f5f2)]
* Merge remote-tracking branch 'origin/master' into extract_style_resources [[a747122](https://github.com/applitools/eyes-cypress/commit/a7471226008a577e148985c8c0a42a187598d0d8)]
* support extracting inner css resources from style tags [[67b5ae3](https://github.com/applitools/eyes-cypress/commit/67b5ae3ae4968f0ff793367fd10899517699c3ba)]
* extract resources from style element + more stuff [[49c4940](https://github.com/applitools/eyes-cypress/commit/49c49409ca6869beaf325282a85f3500fcec7cd0)]
* add .private to .gitignore [[8047deb](https://github.com/applitools/eyes-cypress/commit/8047deb999e0f45848fd82b27a7f3aa9a1cff031)]
* yarn lock [[fff1ba0](https://github.com/applitools/eyes-cypress/commit/fff1ba0358abd4dcb7470be37641051c666f45ea)]
* rename getRenderStatus to waitForRenderedStatus [[dbdde7b](https://github.com/applitools/eyes-cypress/commit/dbdde7b90d33ec8e518f299e2b55d450bfa534c4)]
* 1.2.3 [[eb949c2](https://github.com/applitools/eyes-cypress/commit/eb949c2cc6be7da11f5f886f876e105ef3953f05)]
* 1.2.2 [[c74a1d7](https://github.com/applitools/eyes-cypress/commit/c74a1d7daeb933318fc4e16f3791c6afef908220)]
* made parallism better [[349898d](https://github.com/applitools/eyes-cypress/commit/349898dd353efc344a8565cbbcc9b53da7203a3e)]
* 1.2.1 [[e6e9506](https://github.com/applitools/eyes-cypress/commit/e6e9506f16f5739b45fedbe319c0e9e19f30c0e9)]
* fixed bug whereby checkWindows were in incorrect order [[94e2c5c](https://github.com/applitools/eyes-cypress/commit/94e2c5c5d638033f56da98dc6a3a47a882119dc1)]
* 1.2.0 [[2a1567e](https://github.com/applitools/eyes-cypress/commit/2a1567e8280d75a9e3150e6ac3c251bc50ee1d36)]
* checkWindow now runs in the background [[f5123e7](https://github.com/applitools/eyes-cypress/commit/f5123e7cc5c1d018b6f2551671055e2fb784c248)]
* 1.1.3 [[6fc396e](https://github.com/applitools/eyes-cypress/commit/6fc396ee7d16748117dcdfddaa9e79e7c0360359)]
* added 'tag' support to checkWindow [[da502d1](https://github.com/applitools/eyes-cypress/commit/da502d1c3a979d3670f6d52554a9c5f0cc4b73ce)]
* 1.1.2 [[c999269](https://github.com/applitools/eyes-cypress/commit/c99926978f8b67d78e5654cc45462a36fe2bb9fc)]
* upgraded to eyes.sdk.core@1.6 [[6032bbe](https://github.com/applitools/eyes-cypress/commit/6032bbee5ff8c372a7dd40c8610ce539c1faad0c)]

v1.1.1 / 2018-05-24
===================

* 1.1.1 [[b158697](https://github.com/applitools/eyes-cypress/commit/b15869703c692d3e302c22e7ab666b6d0336f27d)]
* fetch inner css resources [[f8ce95c](https://github.com/applitools/eyes-cypress/commit/f8ce95c4c3408dba6af53da89ce30357f4d2e528)]
* troubleshoot data WIP [[0460973](https://github.com/applitools/eyes-cypress/commit/0460973f21e7df577d4ab065cc2a461141be6f8f)]

v1.1.0 / 2018-05-21
===================

* 1.1.0 [[5efd9ac](https://github.com/applitools/eyes-cypress/commit/5efd9ac46eef50724b3be865225c7849c259bfc6)]
* stop sending script resources [[2ea076f](https://github.com/applitools/eyes-cypress/commit/2ea076fa76f5af266cc89ddca9a476157e74631c)]
* individual and configurable timeout for checkWindow command [[c18dbbd](https://github.com/applitools/eyes-cypress/commit/c18dbbdef788072ca1be39f4cdf96a18f5dc70f7)]
* better cypress command logs [[6908ac5](https://github.com/applitools/eyes-cypress/commit/6908ac5cb3ad8ea9f98341ccab3b1b795351f2c8)]
* fix readme [[06ed695](https://github.com/applitools/eyes-cypress/commit/06ed6959458fd73b4435e355ac0293bd40cbd650)]
* support unhandled node types (like comments) [[c2f885a](https://github.com/applitools/eyes-cypress/commit/c2f885a488b3ab0422e9557960b2b7e88c899a14)]
* add API key to readme [[b5de55e](https://github.com/applitools/eyes-cypress/commit/b5de55edfe3ed9cda965f774a899a06724803f7b)]
* readme with advanced port config [[e96c3e4](https://github.com/applitools/eyes-cypress/commit/e96c3e4888900bf319c757aff0065294f978b509)]
* cypress plugin with fixed/custom port [[aac9861](https://github.com/applitools/eyes-cypress/commit/aac9861f6b266a92138d223abd8e03f5abd5807f)]
* remove buff [[c73053d](https://github.com/applitools/eyes-cypress/commit/c73053d2b28ad5e997b0ce384b5fad305b77060a)]
* e2e test for package and install [[6a302f9](https://github.com/applitools/eyes-cypress/commit/6a302f9ccf9ca575f56c807fd767a8a13753998a)]
* add readme [[f8396cb](https://github.com/applitools/eyes-cypress/commit/f8396cbdbaf325ceb90d5015da64abc316dce6c9)]
* get ready for publish [[dc73e59](https://github.com/applitools/eyes-cypress/commit/dc73e594d1769ea776c4fd9791d55ffdfcf173c7)]
* move cypress folder [[4fc1f8b](https://github.com/applitools/eyes-cypress/commit/4fc1f8ba8a1f547a3bc9e737156782f8b4516be8)]
* refactor getAllResources and add scripts to extractResources [[7637220](https://github.com/applitools/eyes-cypress/commit/76372207ec19a3465386e9d1e3296f7090597353)]
* timeout on render-status [[7e2d476](https://github.com/applitools/eyes-cypress/commit/7e2d4762ce7aeab5e0a209c4ab2a4b7b9862b311)]
* cleanup cypress folder and add e2e tests [[c63d0f4](https://github.com/applitools/eyes-cypress/commit/c63d0f4e09bca51e32450ff7dca735921de7fff6)]
* cypress e2e test [[c03cf29](https://github.com/applitools/eyes-cypress/commit/c03cf29e9448a5079fda903f1c1687dcb86f0698)]
* after code review [[7039445](https://github.com/applitools/eyes-cypress/commit/7039445f04ef1010cbb33b7b9756d2f43f6ec23b)]
* remove unnecessary file [[4cec1ba](https://github.com/applitools/eyes-cypress/commit/4cec1ba9084ecba8950dc83299a446364bc81e1d)]
* cypress plugin with tests [[d21d778](https://github.com/applitools/eyes-cypress/commit/d21d778ec07e4b7a059ab88500922f2ae867d230)]
* update tasks [[9710918](https://github.com/applitools/eyes-cypress/commit/971091878aee536487ceb9ea823dc15f54a2ac7d)]
* more tests [[2a277a5](https://github.com/applitools/eyes-cypress/commit/2a277a50be66025dd9300dc7d31474b95ea8aa26)]
* rearrange tests [[382a75d](https://github.com/applitools/eyes-cypress/commit/382a75dc0c9361ed3bdd5d8fc658c31d5ab99123)]
* rearrange tests [[e345c59](https://github.com/applitools/eyes-cypress/commit/e345c5948343dbbbee1894baf259fdc638964c7a)]
* reorder folders [[c7fef49](https://github.com/applitools/eyes-cypress/commit/c7fef4970bd43af22caa789b6e61615535f4c609)]
* tasks readme format [[b0cd7f4](https://github.com/applitools/eyes-cypress/commit/b0cd7f4275659fc5b977eae0f2e4d30dcb2b8a20)]
* tasks  doc [[c399df5](https://github.com/applitools/eyes-cypress/commit/c399df51d1b8a30be051b88720fb37baba3cd607)]
* fix eslint issues [[410970e](https://github.com/applitools/eyes-cypress/commit/410970ec94a827283a5d774f644798a267153950)]
* fix fixture [[a9f74ca](https://github.com/applitools/eyes-cypress/commit/a9f74ca92a8f32e141b36885354e6aeed339b723)]
* refactor out getRenderStatus [[649dac6](https://github.com/applitools/eyes-cypress/commit/649dac65ce102e8a0f267239b00b59454310e22e)]
* move file [[6e34359](https://github.com/applitools/eyes-cypress/commit/6e3435974700c9f8a65dcbad22030e67573a029e)]
* fix link [[d2d8189](https://github.com/applitools/eyes-cypress/commit/d2d81893418a17e5d03b33b7a95be3db12ce8e12)]
* don't save buffer in local resource cache AND work RGridResource [[ac6dec3](https://github.com/applitools/eyes-cypress/commit/ac6dec3ad3c93150a3c603cd780ed4b1c6619fca)]
* remove 'only' [[9433328](https://github.com/applitools/eyes-cypress/commit/94333283c984ecbad31ab197bfcdb870d389f759)]
* don't save buffer in local resource cache [[5e35c9c](https://github.com/applitools/eyes-cypress/commit/5e35c9c5b9ef22dab0324001869a3c30350504b9)]
* getAllResources with tests [[455615a](https://github.com/applitools/eyes-cypress/commit/455615a9ccd854aae3da4ddff2cf88b257ee7262)]
* change fetchResources test to work with server [[68f90c7](https://github.com/applitools/eyes-cypress/commit/68f90c7f047e7e512ee1a01bb226165588c0b838)]
* take control over render status polling [[ff664b8](https://github.com/applitools/eyes-cypress/commit/ff664b87ee0f8f20563dd33b1fb8e9608c878b34)]
* caching for fetch resources [[e9e407e](https://github.com/applitools/eyes-cypress/commit/e9e407e893fddd0e058e5026f85bf46718b9fb10)]
* debug configuration [[beeaf37](https://github.com/applitools/eyes-cypress/commit/beeaf379f3d8eb887f0af93ad61d83b8c53b52d3)]
* tests against real applitools server [[e72c85e](https://github.com/applitools/eyes-cypress/commit/e72c85ef68d5279423b8f0cb237e433e924806d2)]
* add tests, add test server and rename EyesRunner  to openEyes [[e8f3b69](https://github.com/applitools/eyes-cypress/commit/e8f3b69622efd65af20dcbc6902c8ed7f97b9df0)]
* fix renderWidth exception [[6616cf7](https://github.com/applitools/eyes-cypress/commit/6616cf7bbf941834e5c9dd09c5a892c13ceed198)]
* rename tests folder, refactor a bit [[9ad795e](https://github.com/applitools/eyes-cypress/commit/9ad795ee3bd1613eea754b26970e4eb4ba21565d)]
* make it work in cypress [[947bf1e](https://github.com/applitools/eyes-cypress/commit/947bf1e4435f1df8780faa18a991ed8d9006433e)]
* separate to folders, runner file, tests passing [[1ac4f7f](https://github.com/applitools/eyes-cypress/commit/1ac4f7f47959ab49c9467f7fda954a037f42816a)]
* rename wrapper [[b474bb6](https://github.com/applitools/eyes-cypress/commit/b474bb66d8b053f309b8852bed53c34ba29c36f8)]
* clean up sdk wrapper [[b361096](https://github.com/applitools/eyes-cypress/commit/b36109670800fafccfc1abd7ae82092606919204)]
* working cypress example [[686d6b4](https://github.com/applitools/eyes-cypress/commit/686d6b481290cdbc3bc0b9f7d8358f17832626f9)]
* full flow with jsdom [[92528e7](https://github.com/applitools/eyes-cypress/commit/92528e7815b410971973f0275ad6e1d0f6249d71)]
* lint [[c335f0c](https://github.com/applitools/eyes-cypress/commit/c335f0c1b55cea48828724299e60c820315941ec)]
* extract and fetch resources, use sdk.core render grid API [[b192ac2](https://github.com/applitools/eyes-cypress/commit/b192ac232037d0554ea41ed8b7336dafa0f17d40)]
* initial commit: layout of top-most functionality [[b2796ff](https://github.com/applitools/eyes-cypress/commit/b2796fffef4b62a501c700b20e817f0914f9fe9b)]
