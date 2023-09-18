# Changelog

<a name="3.1.5"></a>
## 3.1.5 (2023-09-18)

### Fixed

- 🚑 Accidentally forgot to change this... [[5d29552](https://github.com/segersniels/supdock/commit/5d29552aaa6ce4827d8452054dbe35468f53d487)]


<a name="3.1.4"></a>
## 3.1.4 (2023-09-18)

### Fixed

- 🚑 Needs to happen in preinstall for symlinking [[bcd2672](https://github.com/segersniels/supdock/commit/bcd26722d6475db0133581849fee41e10e21145e)]

### Miscellaneous

- 📝 Update CHANGELOG [[b2fad3f](https://github.com/segersniels/supdock/commit/b2fad3fd392183fc7f38ddadd8815faa94a6956e)]


<a name="3.1.3"></a>
## 3.1.3 (2023-09-17)

### Changed

- ♻️ Don&#x27;t bother with returning variables and just use globals [[04525de](https://github.com/segersniels/supdock/commit/04525de8c83a7fb9b668e8257f7b2df9b197aa9c)]


<a name="3.1.2"></a>
## 3.1.2 (2023-09-17)

### Fixed

- 🚑 Include postinstall script... [[994bdca](https://github.com/segersniels/supdock/commit/994bdca50dfc35a1e43e320dc2b82bdd18b7459c)]


<a name="3.1.1"></a>
## 3.1.1 (2023-09-17)

### Added

- 👷‍♂️ Move into one workflow and simplify postinstall flow [[edebb95](https://github.com/segersniels/supdock/commit/edebb953d21d0d627245e50d358c4673bb8db298)]
- 👷‍♂️ Simplify CI deploy flow [[d58c2e1](https://github.com/segersniels/supdock/commit/d58c2e12b4875ca6505456cbfaa004c40d0e731b)]

### Changed

- 🚨 Fix linting [[122f4ee](https://github.com/segersniels/supdock/commit/122f4ee870842ca06faf39c496665aff045d6d33)]
- ⚡ Focus on compile speed over size [[2e5bb7f](https://github.com/segersniels/supdock/commit/2e5bb7ff8c71640439df4cce0f16223d804a3518)]

### Removed

- 🔥 Remove unused targets [[fc391f1](https://github.com/segersniels/supdock/commit/fc391f1e61903d847a7102e9bc6210850ee0a20f)]

### Fixed

- 💚 We no longer download from other workflow [[8c9329f](https://github.com/segersniels/supdock/commit/8c9329faa8a27e08ba7e0b3ded78746562e0f491)]
- 💚 Specify required job [[50ae878](https://github.com/segersniels/supdock/commit/50ae878b2bd439e483ae7ad8d8c9468b72f11bbb)]
- 💚 Specify conditions when to run [[37a0556](https://github.com/segersniels/supdock/commit/37a0556ccc17119fb858bc96cca6e99dbf7d12b7)]

### Miscellaneous

- 📝 Update CHANGELOG [[ebc174e](https://github.com/segersniels/supdock/commit/ebc174e1bb700489f3acdc3d92ded04d0cc742a1)]


<a name="3.1.0"></a>
## 3.1.0 (2023-06-26)

### Added

- ✨ Add extra support for --all and --volumes flags when pruning [[e6a0cca](https://github.com/segersniels/supdock/commit/e6a0ccade97057ce00fceee9cf1c38637a31954a)]

### Changed

- ♻️ Refactor so directory structure makes more sense [[6386bf8](https://github.com/segersniels/supdock/commit/6386bf8ec69926b5ed72fedb16f2862230d0eae2)]
- ⬆️ Bump deps [[8172f0c](https://github.com/segersniels/supdock/commit/8172f0ca6eb9e85994c498efca7c456386af3b98)]

### Miscellaneous

- 🔨 Apparantly awk doesn&#x27;t work as expected in make [[6d6ca49](https://github.com/segersniels/supdock/commit/6d6ca49125f47fbf052789e00eddaa81e87963a8)]
- 🔨 Match both # and @ [[3a99d90](https://github.com/segersniels/supdock/commit/3a99d905a55183a8e4685c98025288e87c135637)]
- 📝 Update changelog [[a710a9b](https://github.com/segersniels/supdock/commit/a710a9b6767eabc84b30b3b0de287458bfbd2b96)]


<a name="3.0.5"></a>
## 3.0.5 (2023-04-25)

### Fixed

- 🐛 Make sure we fallback to an empty list [[7baef9e](https://github.com/segersniels/supdock/commit/7baef9e273e0d03f2410f48116b12442712c0205)]

### Miscellaneous

- 📝 Update changelog [[8a08715](https://github.com/segersniels/supdock/commit/8a08715b382ba4437c7e7104d12c9fa873d1ea12)]


<a name="3.0.4"></a>
## 3.0.4 (2023-04-24)

### Added

- 👷‍♂️ Run as node 18 [[1d2f378](https://github.com/segersniels/supdock/commit/1d2f3780d8576ac128b01688b5c48ffc7d56cc71)]
- 👷‍♂️ See if we can trigger npm publish separately [[6355e15](https://github.com/segersniels/supdock/commit/6355e15430a7d2b6f602b511855eea923c5d65d0)]

### Changed

- ♻️ Properly use the lifetime and borrow system [[c2f8de8](https://github.com/segersniels/supdock/commit/c2f8de8654b66843fb21f6d1fdd42aaf5513b7d7)]

### Fixed

- 💚 Prevent creating git commits when changing version [[2fbbc5f](https://github.com/segersniels/supdock/commit/2fbbc5f551f49957efb207e8ff997af4f25ad6e7)]
- 💚 Remove obsolete need [[f2dbebc](https://github.com/segersniels/supdock/commit/f2dbebc3d6823ba618270c5832433fadb4db601f)]


<a name="3.0.3"></a>
## 3.0.3 (2023-04-16)

### Fixed

- 💚 Prepare the .npmrc file beforehand [[31c6a6d](https://github.com/segersniels/supdock/commit/31c6a6db459fbad6051ed5ec2cf42920340e0c32)]

### Miscellaneous

- 🔨 Force tag generation [[59984a7](https://github.com/segersniels/supdock/commit/59984a748e98438972aeec4c5905462e8b2a3456)]


<a name="3.0.2"></a>
## 3.0.2 (2023-04-16)

### Added

- 🔊 Debugging wise check where it extracts the artifact [[edf4ea9](https://github.com/segersniels/supdock/commit/edf4ea965d15f66170c187acb74bd6ccd2c17cb9)]
- 👷‍♂️ Adjust so we wait for release to succeeed [[1b36752](https://github.com/segersniels/supdock/commit/1b367525c26b96e1577cb2017f8c1be8998ffc32)]
- 👷‍♂️ We no longer need to generate since we include it now [[75ec647](https://github.com/segersniels/supdock/commit/75ec6474015fe5ef7230cdbf599c0d15542af158)]
- 👷‍♂️ Let&#x27;s try this for real this time [[40a3d49](https://github.com/segersniels/supdock/commit/40a3d49a5ceb79252c15de7bc538a1d8a848fa13)]
- 👷‍♂️ Drop the copy pasta name [[40d871a](https://github.com/segersniels/supdock/commit/40d871acd04c5f1b3ac741f6050111a01020a898)]
- 👷‍♂️ Force cargo install so the lockfile gets created [[fd3cae1](https://github.com/segersniels/supdock/commit/fd3cae1b49b649342377dcbae30ea7c5fdfb0368)]
- 👷‍♂️ Forgot the github release action is unmaintained [[86309c2](https://github.com/segersniels/supdock/commit/86309c25f1db0c8684c92802a030ab5c48ad75b4)]
- 👷‍♂️ Only build linux on develop [[4e5f145](https://github.com/segersniels/supdock/commit/4e5f145d4e79c9aa56a7fac53a14e9a2201cab0f)]
- 👷‍♂️ For now see if a dry run works as intended [[c646a6e](https://github.com/segersniels/supdock/commit/c646a6e9f376abb51e4d591363bd09c9b4c511f3)]
- 👷‍♂️ Always build, even on PRs to ensure everything keeps working [[ce54849](https://github.com/segersniels/supdock/commit/ce5484972c772a7401b62c3b5e98d4d1346e0e95)]
- 👷‍♂️ Adjust deploy flow and artifact sharing [[f3a1cb1](https://github.com/segersniels/supdock/commit/f3a1cb167888072f76f2832697bb1a70a2fa2fa8)]
- 👷‍♂️ Should publish cargo as well [[0d5432d](https://github.com/segersniels/supdock/commit/0d5432dfaa895206cb481ce562d71d0d5f9d5f26)]
- 👷‍♂️ Only build on master or develop [[fb18149](https://github.com/segersniels/supdock/commit/fb181496a5640a8fc79008b4e89c29095f48b851)]
- 👷‍♂️ Provide way to publish npm through dispatch [[0891e59](https://github.com/segersniels/supdock/commit/0891e593ecb06da5b98959e07fe9b7e708c79fcf)]
- ✨ Initial rewrite in rust [[612be85](https://github.com/segersniels/supdock/commit/612be8567059690fdcc65814c90ad6e2f9b939c7)]

### Changed

- ⬆️ Bump deps [[9b3518a](https://github.com/segersniels/supdock/commit/9b3518a1b7711adb5a7bdf72f4a986c44d16ca75)]
- 🔧 Mention authors in manifest [[45a48db](https://github.com/segersniels/supdock/commit/45a48dbd7ca07b5507d94c9b8dccf0abeefeef90)]
- 🚨 Fix linting [[7e83610](https://github.com/segersniels/supdock/commit/7e836101f554b0e8460e61bf217636ae48c1c4cf)]
- 🔧 Bring manifest in line [[9d66b2b](https://github.com/segersniels/supdock/commit/9d66b2bc0657724f31a55e595faedb4682a4f865)]
- 🔧 Properly handle yaml files [[05829f6](https://github.com/segersniels/supdock/commit/05829f62dd62b70f75dd0fb4b13d47bb90e30e95)]
- ♻️ Use CARGO exported env vars [[b848264](https://github.com/segersniels/supdock/commit/b8482641c952bfe14395ebc90f82d9878b4833af)]
- 🔧 Bring configs in sync with live version [[6447a3f](https://github.com/segersniels/supdock/commit/6447a3fe90e7de8045ef0c01b8c84c869ce342d8)]

### Fixed

- 🚑 Fix download url [[2596838](https://github.com/segersniels/supdock/commit/259683897b878d0367090fa40da2f2834a036aec)]
- 💚 Provide NPM_TOKEN [[cad6b3e](https://github.com/segersniels/supdock/commit/cad6b3e740d6c049cadd95abfb7a6f6c05a73570)]
- 💚 Ok it extracts it entirely to the current directory so just specify the bin directory [[10a5877](https://github.com/segersniels/supdock/commit/10a5877b33b2ece93eb77e806754c4b5c556074c)]
- 💚 Specify which branch and the name of the artifact [[298adfd](https://github.com/segersniels/supdock/commit/298adfd8ba3269b900d758e28342728bcc687bb5)]
- 💚 Fetch the secret and store in env [[c5ae941](https://github.com/segersniels/supdock/commit/c5ae9413f2e3fe0fdf8bd296fc4e5ba777c20451)]
- 💚 Specify which workflow to pull from [[e410a5f](https://github.com/segersniels/supdock/commit/e410a5f02f6eef005cc00cee71cb1d79effb1655)]
- 🚑 Remove any lingering references to temp rewrite bin [[23353d3](https://github.com/segersniels/supdock/commit/23353d3b260cda3298f24d4fb5f9d594ac9bb593)]
- 💚 Ignore the fact that we already have set the packge.json version [[3eba41d](https://github.com/segersniels/supdock/commit/3eba41dbbb540c75a46512c64f72c1141d7cdc05)]
- 💚 Drop deprecated way of setting output [[1680d71](https://github.com/segersniels/supdock/commit/1680d711df8c2702d4ab95515638da69a01d0b73)]
- 💚 Use generate-lockfile instead to generate the lockfile duh [[157f4cc](https://github.com/segersniels/supdock/commit/157f4cc165602e80c945e8fc7294b61a1a46b31e)]
- 💚 Be sure to checkout repo before doing anything [[481388b](https://github.com/segersniels/supdock/commit/481388b75b887c4f56b966632a5d101e619f23d8)]
- 💚 Move version output to prepare step [[3989d42](https://github.com/segersniels/supdock/commit/3989d427e7cc48ccc9d4a68e832e00ca67962e22)]
- 💚 Remove unused needs [[0d5b86c](https://github.com/segersniels/supdock/commit/0d5b86ca970421dec46fad829048a12b32815854)]
- 🐛 Display the version [[723ae63](https://github.com/segersniels/supdock/commit/723ae635ffccd2efd33c2c68e4288847b094e61e)]

### Miscellaneous

- 🙈 Include Cargo.lock [[9007e6a](https://github.com/segersniels/supdock/commit/9007e6a0e32c2462cffedb3dba9dc1860e556a40)]
- 📝 Remove lingering in progress rewrite usage [[fc4c90a](https://github.com/segersniels/supdock/commit/fc4c90ac8b50615a6c9e901ec624e5ccbac2c7cd)]
- 📝 Update CHANGELOG [[dd4b5e4](https://github.com/segersniels/supdock/commit/dd4b5e41d5e0db233b5887d0b58c6158e0dc6a61)]
-  Merge pull request [#17](https://github.com/segersniels/supdock/issues/17) from segersniels/feature/rust [[1a95e0e](https://github.com/segersniels/supdock/commit/1a95e0e9b24b3029f88e4a9f3e634122f109e25b)]
- 📝 Remove documentation that is no longer applicable [[a6a33ca](https://github.com/segersniels/supdock/commit/a6a33ca7d53f047bdf5d18ba235bb254996c946f)]
- 📝 Update changelog [[fbb47f9](https://github.com/segersniels/supdock/commit/fbb47f9cfa14e4487ae1a20fb161cb500bd065fa)]


<a name="2.8.6"></a>
## 2.8.6 (2023-02-15)

### Added

- 👷‍♂️ For now just remove the concurrency cancel [[cbdce08](https://github.com/segersniels/supdock/commit/cbdce08cdd8e110aeadff1f96fba91b5b6ae6952)]

### Changed

- ♻️ Keep asking for file to cat [[94475f8](https://github.com/segersniels/supdock/commit/94475f851c9a92568446dac048867322d43e7407)]
- 🚸 Make sure we exit when user cancels prompt [[58b7a8b](https://github.com/segersniels/supdock/commit/58b7a8b5b8e5a21d4de0f9fe600b442fd6a46a15)]

### Miscellaneous

- 📝 Update changelog [[b2d6462](https://github.com/segersniels/supdock/commit/b2d6462676ab2abaeb7a6644c1595ed5fc8d4c87)]
- 🔨 Make sure we generate missing tags if they don&#x27;t exist yet [[2a3ac31](https://github.com/segersniels/supdock/commit/2a3ac31c938f454f1e297679ef52b646bafca768)]


<a name="2.8.5"></a>
## 2.8.5 (2022-07-06)

### Changed

- 🔧 Add basic editorconfig to actually match the indentation for rust files [[cc95f01](https://github.com/segersniels/supdock/commit/cc95f01b3e505c8fe15bec908c22ce615421e793)]
- 🚸 Make sure to do some more in depth searching based on character splits [[ad09e3b](https://github.com/segersniels/supdock/commit/ad09e3bfcdb5bb7b4e76f83dd179479954f1a159)]

### Fixed

- 🐛 Make sure we only provide the actual fuzzy search results to the user [[f173c4a](https://github.com/segersniels/supdock/commit/f173c4abbd88fd07d636deaab0aedfa7ef235ce3)]


<a name="2.8.4"></a>
## 2.8.4 (2022-07-05)

### Added

- ➕ Add gitmoji-changelog [[b08b632](https://github.com/segersniels/supdock/commit/b08b6328cf7cda24c62ebe72d8773e4de75dbb8f)]

### Changed

- ♻️ Centralise errors to prevent mismatches [[4b418dc](https://github.com/segersniels/supdock/commit/4b418dc8580a7586ebf6cbd46e58165ca22762da)]

### Fixed

- 🐛 Allow fuzzy searching when name provided [[44240c2](https://github.com/segersniels/supdock/commit/44240c289b56b62024b80edbb19a889cfc15e2b0)]
- 🐛 Make sure to target correct error [[c975f45](https://github.com/segersniels/supdock/commit/c975f45df392d95b52f4d62357600532dea14ffb)]

### Miscellaneous

- 📝 Generate changelog from commits [[b6b5c51](https://github.com/segersniels/supdock/commit/b6b5c51a927c572460ff753bb59d399170b6ad1a)]


<a name="2.8.2"></a>
## 2.8.2 (2022-07-04)

### Added

- 👷‍♂️ Check the output versions to know if we should publish beta or latest [[41a9211](https://github.com/segersniels/supdock/commit/41a9211e0ee1e4db323d4314733e766609d18fcd)]

### Fixed

- 🐛 Dedup requires the array to be sorted [[77f7ae2](https://github.com/segersniels/supdock/commit/77f7ae22017c8fb6bd7498d1f201807e211e341e)]


<a name="2.8.1"></a>
## 2.8.1 (2022-07-04)

### Fixed

- 🚑 Need to await the errorhandler caught errors [[16ccbde](https://github.com/segersniels/supdock/commit/16ccbde9ed1a43f2d59b7dc02471e88e93e18cd6)]


<a name="2.8.0"></a>
## 2.8.0 (2022-07-04)

### Changed

- ⚡ Further optimise for speed [[1645b55](https://github.com/segersniels/supdock/commit/1645b555cc5165ddc337a114edee90f046a6f6d2)]
- ♻️ Implement own jaro_winkler calculation to have more control over the fuzzy searching itself [[d4bb4cd](https://github.com/segersniels/supdock/commit/d4bb4cda3ce90663b3055d7720b8c987dbfb8cab)]

### Removed

- 🔥 Remove lingering debug code [[f487d6e](https://github.com/segersniels/supdock/commit/f487d6ecb797cbbaa3cdab5446259412172e5e4a)]

### Fixed

- 🐛 Still pointing to old name [[64dcac5](https://github.com/segersniels/supdock/commit/64dcac5b9dde52fdd7b7f73390ac9b80f01b13b1)]


<a name="2.7.7"></a>
## 2.7.7 (2022-07-04)

### Changed

- ♻️ Extract actual search into module so we can easily replace it for later optim [[c517ce6](https://github.com/segersniels/supdock/commit/c517ce6ad3e7bf31a2755638e5dbe10e7d4b3fd7)]

### Miscellaneous

- 🧑‍💻 Drop the root Makefile and make the package.json scripts more readable and usable [[4687cdd](https://github.com/segersniels/supdock/commit/4687cdd164d1bf6f09809244d0ddaf9bcceafa32)]


<a name="2.7.6"></a>
## 2.7.6 (2022-07-04)

### Added

- 👷‍♂️ Cancel in progress [[d8d5039](https://github.com/segersniels/supdock/commit/d8d5039a1e0c3f8b81459a0e94373b8b1270665c)]
- 👷‍♂️ Don&#x27;t error when already published this specific beta version [[6b63002](https://github.com/segersniels/supdock/commit/6b630024f5302f07a7c65f4f3f2ebf0e5c362fc5)]
- ➕ Add tsup [[716b0d5](https://github.com/segersniels/supdock/commit/716b0d5ca1345a256d136176d3b2d62932584c58)]

### Changed

- 🎨 Remove duplicate code [[4cee007](https://github.com/segersniels/supdock/commit/4cee0071b992859f96c215dc917dccb520f2f4c1)]
- ♻️ Check for identical matches and not on partial split() matches [[ddc5450](https://github.com/segersniels/supdock/commit/ddc545062dc50092347cb867aae9692f5121dc82)]
- 🔧 Target node12 instead to support default node installs on most linux systems [[12d4d97](https://github.com/segersniels/supdock/commit/12d4d9745e07284f636056b15971bf308c5bb54d)]
- ♻️ Return to ensure we see debugging values of the child_process commands [[5a0f80c](https://github.com/segersniels/supdock/commit/5a0f80cdf9fd5341c7e7b729477e449920c40023)]
- 🎨 Clean up [[c0014a7](https://github.com/segersniels/supdock/commit/c0014a749d0a3fc9274bcc1b094bf67287752b37)]
- ♻️ Don&#x27;t process.exit() manually but just exit code flow early [[2319b90](https://github.com/segersniels/supdock/commit/2319b90455c93556dd41a633dbc74c70d6a527f2)]
- ♻️ Graceful exit [[b24d86d](https://github.com/segersniels/supdock/commit/b24d86d638e9081c266513840d5ef570cce5b4e8)]
- ⬆️ Bump deps [[d5de4a4](https://github.com/segersniels/supdock/commit/d5de4a4de2c5fdc7f82b243dbabd580df99c7d47)]
- 🔧 Switch from ncc to tsup to compile [[884bbf8](https://github.com/segersniels/supdock/commit/884bbf82bab5ae58b31a42e69f219a9291501653)]

### Removed

- ➖ Remove fuzzy-search [[fa0a647](https://github.com/segersniels/supdock/commit/fa0a647079bd58eeaf1f67b6bd53db59f1ce6f45)]
- ➖ Remove sinon [[dbaacd9](https://github.com/segersniels/supdock/commit/dbaacd9be48893705119c0fd8bda5c24515ec3d6)]
- ➖ Remove @vercel/ncc [[9ef29e3](https://github.com/segersniels/supdock/commit/9ef29e327f791ade2972d588828fd8bd43f4ead2)]

### Fixed

- 🐛 Treat nonFlags as strings at all times [[29a48d5](https://github.com/segersniels/supdock/commit/29a48d5cb12ec2a34a4f661c093ee80977e70f58)]
- 🚑 Don&#x27;t limit to two results, returm them all and join them back together [[792d98e](https://github.com/segersniels/supdock/commit/792d98ebf9c96e1a0146e72d9d2a48b4690b44f6)]
- 💚 Target package.json so pkg config gets read [[b13f2cf](https://github.com/segersniels/supdock/commit/b13f2cfe81f82dbdfa08f9e81f78385cfb407133)]
- 💚 Install wasm-pack [[13da961](https://github.com/segersniels/supdock/commit/13da9615593f9f1e8d79b474b45b1decba4908a4)]
- 🚑 Seems like Makefiles were ignored... [[1c3f602](https://github.com/segersniels/supdock/commit/1c3f6025c252a44abbc039701bb10b94ef16381b)]
- 💚 Make sure to compile wasm before trying to run typescript checks [[3225832](https://github.com/segersniels/supdock/commit/322583279c80709942cc77e9adf0789454edc6a1)]
- ✏️ Fix typo [[1f416b0](https://github.com/segersniels/supdock/commit/1f416b02b2d70314ad7a4761acd99977c633de9c)]
- ✏️ Typo in comment [[5472c4d](https://github.com/segersniels/supdock/commit/5472c4d9064b70c98d3732495620bf1a0d998cb9)]

### Miscellaneous

- ⚗️ Move fuzzy searching entirely to rust, needs optimisation [[d724963](https://github.com/segersniels/supdock/commit/d7249637db0b205c1685eab1b920f80c6a61d314)]
- 📝 Match description [[4e849ed](https://github.com/segersniels/supdock/commit/4e849edbae830b3563759302e61985d70b0f0947)]
- 📝 Update changelog [[75211da](https://github.com/segersniels/supdock/commit/75211dafc40f9ec3ee020f140e13b852242e5208)]
- 📝 Match quote [[da61c32](https://github.com/segersniels/supdock/commit/da61c32a66820bbde7d9e70919e4a77c2b7f0ead)]


<a name="2.7.5"></a>
## 2.7.5 (2022-04-26)

### Added

- ✅ Bypass invalid typing because of migration [[7f696de](https://github.com/segersniels/supdock/commit/7f696de5c7d471e35fa57b959816d1a3aa4507f6)]
- ✨ Enable fuzzy search by default for new users [[a95c741](https://github.com/segersniels/supdock/commit/a95c741b85f7c1f867baf65dd9e804aa5fcf660a)]
- 🔊 Log that the user can disable the caution check since enabled by default [[df4ae2b](https://github.com/segersniels/supdock/commit/df4ae2bbd9e2b48b2773568cf607694253ab1782)]
- 👷‍♂️ Build dependent on branches [[5a5ef66](https://github.com/segersniels/supdock/commit/5a5ef66fa49ecb63012c0b85b2fd9b31e9461503)]

### Changed

- ⬇️ Downgrade to non es module [[36ff623](https://github.com/segersniels/supdock/commit/36ff623903b67aa8de5421d3673cb6af6125a93e)]
- ⚡ Target node16 [[920c231](https://github.com/segersniels/supdock/commit/920c23174caff4a9a46ce30533074b24ec943154)]
- ⬆️ Bump dependencies to latest [[a8ed2e3](https://github.com/segersniels/supdock/commit/a8ed2e3a621c14b5302758f0d4a5bbf5160d8207)]

### Removed

- 🔥 Remove lingering test code [[e77b702](https://github.com/segersniels/supdock/commit/e77b7026b4962a6704aaff93c1faddadbf580f2f)]

### Fixed

- 💚 Remove manual version bump [[20bac20](https://github.com/segersniels/supdock/commit/20bac20c85aeb8d945fc85bbad82aae77748a888)]
- 🐛 Exclude binary path from config prompt [[cedbab0](https://github.com/segersniels/supdock/commit/cedbab07de8e3aa96ed9a243b25fbf8ef12f2153)]
- 💚 Add beta suffix so versions don&#x27;t interfere [[b80421e](https://github.com/segersniels/supdock/commit/b80421ef011aa334f0a2782455e38249c5184c5a)]
- 💚 Just build on corresponding branch and attempt to publish independent if commit message reflects it [[a3a3db6](https://github.com/segersniels/supdock/commit/a3a3db6912a2b9c567acad44f9a9e4df205f674d)]
- 💚 Don&#x27;t fail the build if already published [[4beab4a](https://github.com/segersniels/supdock/commit/4beab4a4a6a932779c6ad53e933cd42106e0b29d)]
- 💚 Changed master to main branch apparently [[0de9544](https://github.com/segersniels/supdock/commit/0de954401ff2cae5d272d15a98a5fc9a9a5d8bbf)]
- 🐛 Add missing log statement during verbose info [[74836e9](https://github.com/segersniels/supdock/commit/74836e9a3f51952a7f4af3ca9ba097302141e128)]

### Miscellaneous

- 🏷️ Mark errors as correct execution errors [[04dbb43](https://github.com/segersniels/supdock/commit/04dbb438a3b1048da02e39e277a445166d0d5536)]


<a name="2.7.2"></a>
## 2.7.2 (2021-08-06)

### Added

- 👷‍♂️ Extract renaming of binaries to separate job [[cdab06b](https://github.com/segersniels/supdock/commit/cdab06bcd5e7ba43dde24ef8b1d175ce88b06fdd)]
- ➕ Utilise ts-custom-error to prevent breaking custom errors when compiling [[ddf79ce](https://github.com/segersniels/supdock/commit/ddf79ce5a489351a0032a6b901a03c68de047784)]
- ➕ Replace debug tracing with @aiteq/trace [[2548290](https://github.com/segersniels/supdock/commit/25482908ba7b1eaf3a439479e4157e0dca38c990)]

### Changed

- 🔧 Bump node version to 14 [[399c4c9](https://github.com/segersniels/supdock/commit/399c4c920655c8a8359095b572c72ab4a01666cd)]
- 🎨 Improve readability of fuzzy helper [[fe48734](https://github.com/segersniels/supdock/commit/fe4873437cbe0b741d7ac593d0e43a3a93082731)]
- ♻️ Make certain methods protected instead of public [[d61d6c9](https://github.com/segersniels/supdock/commit/d61d6c990930a0065e01be35b832a43a3752ae62)]
- ♻️ Move functionality to helpers to improve readability and clean up [[d7a1fa5](https://github.com/segersniels/supdock/commit/d7a1fa50b5e05ebcaf97e301d9ab7ea5d26c763e)]
- ⬆️ Bump deps [[15da073](https://github.com/segersniels/supdock/commit/15da07390e454d276de19690c2157571a4e29082)]
- ⬆️ Bump y18n from 4.0.0 to 4.0.1 [[a0394da](https://github.com/segersniels/supdock/commit/a0394da556017c4f14b15ca50c662693d5f08879)]

### Removed

- 🔥 Remove tests since they are not sustainable the way they are implemented now [[d903cbe](https://github.com/segersniels/supdock/commit/d903cbea1a8984a8fc582362f733ca99e2e46ee6)]

### Fixed

- 🚑 Prompt was updated and fucked the choice [[6e654b6](https://github.com/segersniels/supdock/commit/6e654b69aa601baa212b63924cbe96ef058c4659)]
- 💚 Also build on construction_worker emote [[e42776f](https://github.com/segersniels/supdock/commit/e42776f2dbbeea3737c9975a16a9b07a6827c8e2)]


<a name="2.7.1"></a>
## 2.7.1 (2021-03-08)

### Changed

- 🎨 More readable validation [[dc7d70f](https://github.com/segersniels/supdock/commit/dc7d70fc4431891e65391c05b98dbf69e88b70a2)]
- 🎨 Throw execution error and let error handler handle [[8dd3d36](https://github.com/segersniels/supdock/commit/8dd3d3691428eb6c214ed2c076ab20d411049a92)]
- 🎨 Await [[b84e61b](https://github.com/segersniels/supdock/commit/b84e61b562b1f28330773fe1ec5855a41231c42a)]
- 🚚 Moving Command straight under src [[3d0389c](https://github.com/segersniels/supdock/commit/3d0389ca5f80dab7e76081b90ec2fc151c037916)]
- 🔧 Remove yarn error log [[cbeeb94](https://github.com/segersniels/supdock/commit/cbeeb94484583d3e045a134e9418c2f733631b77)]

### Removed

- 🔥 Remove unused code [[0cb2a17](https://github.com/segersniels/supdock/commit/0cb2a17addaa6894c047d1a2913039f6ae56516d)]

### Fixed

- 🐛 Dont continue when user aborted choice [[bb8826c](https://github.com/segersniels/supdock/commit/bb8826c4bdd40fd30a3b94856fb567a192271da0)]


<a name="2.7.0"></a>
## 2.7.0 (2020-12-01)

### Added

- ✅ Don&#x27;t execute during test [[e301fb7](https://github.com/segersniels/supdock/commit/e301fb76c984b91f81f24891c67b0e93c25eae31)]
- ✨ Try to determine the docker binary path [[e35c985](https://github.com/segersniels/supdock/commit/e35c98538d611dc1cd191c1c815ce6f1d2146529)]
- ➕ Add which@1.3.2 [[7af6be9](https://github.com/segersniels/supdock/commit/7af6be96c4e36522bdc581a0003b351d9e7462f5)]

### Changed

- ♻️ Don&#x27;t fallback to a predefined path but let user configure if needed [[872e943](https://github.com/segersniels/supdock/commit/872e9437ed7c19d1656b109c90d9ef0df6882548)]
- ⬆️ Bump deps [[cbfa1ad](https://github.com/segersniels/supdock/commit/cbfa1adee80554523ac623f0fc63ea946110fb4f)]

### Removed

- 🔥 Remove now unused ghr script [[f5e2a35](https://github.com/segersniels/supdock/commit/f5e2a3500c343bdcf23008ed500afda5a7bca912)]

### Fixed

- 🐛 Ensure metadata is valid before destructuring [[2210e64](https://github.com/segersniels/supdock/commit/2210e64c733601366825b4c7b892b3d2abb87717)]
- 🐛 Import from correct command [[5960b6d](https://github.com/segersniels/supdock/commit/5960b6d31763779b87210b868154eab841be3aa1)]
- 💚 Temporarily always succeed yarn publishing so we can test github releasing&quot; [[ec94e97](https://github.com/segersniels/supdock/commit/ec94e9773fb625c661af8d96d1e6bbba1ff18586)]


<a name="2.6.0"></a>
## 2.6.0 (2020-09-11)

### Added

- ✅ Correctly describe test [[0a52d09](https://github.com/segersniels/supdock/commit/0a52d09591893be67bc3d5ce35f505318aaeb710)]
- ✅ Prevent logging while running tests [[89d5663](https://github.com/segersniels/supdock/commit/89d56638168ea0ea2c8e1bded6d09b64285416f8)]
- ✅ Move test to correct command execution [[059e166](https://github.com/segersniels/supdock/commit/059e1663ebc57aa30c778454a1b3fcb810e811f6)]
- ✨ Allow restart to prompt user for start [[a42ce7b](https://github.com/segersniels/supdock/commit/a42ce7b0d63712688f3a25e770903b11470fd339)]
- ✅ Fix test now that usage is moved to entrypoint instead of run() [[03b0abf](https://github.com/segersniels/supdock/commit/03b0abf0d923f5cb5a8bbc4bb833843741645a4f)]

### Changed

- ⬆️ Bump packaging dependencies [[e56d17b](https://github.com/segersniels/supdock/commit/e56d17bddde62ed0d3228a77d5112cd7dc199141)]
- 🎨 Improve readability [[312e14d](https://github.com/segersniels/supdock/commit/312e14dd0c905785cfb0374e61d2335615900f89)]
- 🎨 Move parallel execution check outside of default run and move to commands where needed [[24e3e83](https://github.com/segersniels/supdock/commit/24e3e835c0877333373f7e9994032721d0fbd4f7)]
- ♻️ Move general try catch to top level and improve readability [[7f698bf](https://github.com/segersniels/supdock/commit/7f698bfaed36f18deec85a028d41f3885081446d)]
- ♻️ Convert yes no choice to default confirm [[f2bce23](https://github.com/segersniels/supdock/commit/f2bce232c0cc601b0753c352e04b5405bf9a6052)]
- ♻️ Execute async block directly instead of calling run() [[ed6b7e5](https://github.com/segersniels/supdock/commit/ed6b7e5618abcc60b8f399df5ff576cb08f00d23)]
- ♻️ Instead of injecting run custom logic first and then super.run() [[d0583d7](https://github.com/segersniels/supdock/commit/d0583d798603ed7167fad5a6e4242a0256419bef)]
- ♻️ Extract version and usage to entrypoint [[adf3426](https://github.com/segersniels/supdock/commit/adf34266710b448f46a2d7f7fbc52af5f8c097bc)]

### Removed

- 🔥 Unused optional config [[0051d26](https://github.com/segersniels/supdock/commit/0051d26da6143306824b0b2f6e642173fa4e390e)]
- 🔥 Remove circle build [[3fa88a1](https://github.com/segersniels/supdock/commit/3fa88a1ecdaf0591b8d98b4d6b4abab582e50332)]
- 🔥 No need to initialize as null [[288be70](https://github.com/segersniels/supdock/commit/288be70e5f1d890cc5e0f31a095085810e674669)]
- 🔥 Remove inject [[fe138c2](https://github.com/segersniels/supdock/commit/fe138c2334e25e52dbffb32227e5d6955d54d081)]

### Fixed

- 💚 Doesnt seem to like multiline [[1847b11](https://github.com/segersniels/supdock/commit/1847b1158f6eb93f28e5e8388f7dbf03c41bbcfb)]
- 💚 Make sure quotation marks are wrapped around entire conditional statement [[dc1fb64](https://github.com/segersniels/supdock/commit/dc1fb646da991d45c3aaa8686013ef03460019d2)]
- 💚 Fix release tag name [[4aed8e6](https://github.com/segersniels/supdock/commit/4aed8e6250cb5c38f929512ca3f266ad93604374)]
- 💚 Try to move version output from step to job output so we can call conditionally on other jobs [[ded0cb2](https://github.com/segersniels/supdock/commit/ded0cb2f78408508a385a8dc5215b3ac844676bf)]
- 💚 Temporarily always succeed yarn publishing so we can test github releasing [[1eb7095](https://github.com/segersniels/supdock/commit/1eb709523eb5c35d5d55ae59553bf4bb16eeabb8)]
- 💚 Move NPM secret up now that we are registering in first job [[78bd942](https://github.com/segersniels/supdock/commit/78bd9421d8d80f3a58588c4dad1f4c2cfa9fbc6f)]
- 💚 Run both beta and master release but have early failure [[ae7dae5](https://github.com/segersniels/supdock/commit/ae7dae5856596bb1902d0a2b4f18e7aaf8fb40f5)]
- 💚 Dont run release if beta [[2f3fa3a](https://github.com/segersniels/supdock/commit/2f3fa3a55ee4623f824b55be042d3a1a090761a0)]
- 💚 Allow running for CI debugging purposes [[94cc225](https://github.com/segersniels/supdock/commit/94cc225a0d6d1f0e08d2764393f3ac1076d4bee6)]
- 💚 Release name has always been version [[8d3a3cf](https://github.com/segersniels/supdock/commit/8d3a3cf8680d811d064be7fd75398b75564cce32)]
- 💚 Split github release from npm publish since things need fixing [[0f56ad9](https://github.com/segersniels/supdock/commit/0f56ad9dd86c1cbbd8b5c696b42e761046dc89db)]
- 💚 Only run release job when bookmark is detected in commit message [[e257a95](https://github.com/segersniels/supdock/commit/e257a9533f9d5e0c7b896e4b85ced0515f6af49c)]
- 💚 Conditional releasing adjusted to github actions [[b05e747](https://github.com/segersniels/supdock/commit/b05e7472e84ba962a56e03d4745860148ba581d5)]
- 💚 Initial conversion to github actions [[dc6596d](https://github.com/segersniels/supdock/commit/dc6596db3c5b70d5efe9239b5748ed76b9eacae6)]
- 💚 Correctly grab version [[71e8971](https://github.com/segersniels/supdock/commit/71e8971cbc3116df40efa5a1a278f3ffe727434d)]
- 🚑 Return when logging version and usage [[02b547d](https://github.com/segersniels/supdock/commit/02b547d0bb34742900a9b4a07bb974d81f45c551)]
- 💚 Only release to github when non beta [[797bbdb](https://github.com/segersniels/supdock/commit/797bbdb14821deff466738adfbc36e6b361be403)]
- 💚 Move away from multiple branches to single master branch [[fa5b8b6](https://github.com/segersniels/supdock/commit/fa5b8b6e65db47e21c8805178513c48261b1c91a)]
- 💚 Use node:12 [[554505f](https://github.com/segersniels/supdock/commit/554505ffcb16f44d39334c413c04aa069df91769)]

### Miscellaneous

- 📝 Move CHANGELOG to separate file [[dfe357a](https://github.com/segersniels/supdock/commit/dfe357afba5614a44e6fda12625a4461ab6a6216)]
- 📝 Display github actions badge [[3ca1095](https://github.com/segersniels/supdock/commit/3ca109528d06bbec2e91447000956ccd5f161c38)]


<a name="2.5.0"></a>
## 2.5.0 (2020-07-19)

### Added

- ✨ Support cat command [[b8e70c0](https://github.com/segersniels/supdock/commit/b8e70c02ae52d57f08ddb05926d89aaeeeb9af8d)]
- ✅ Use sinon mocking instead of having an ugly internal config [[f36a257](https://github.com/segersniels/supdock/commit/f36a257da591604c56a63757c0616c93d22645a7)]
- ✨ Add sinon mock method to stub specific behaviour [[1d4163b](https://github.com/segersniels/supdock/commit/1d4163b5b69ef4b8c58bccc6ce477320111821ee)]
- ➕ Add sinon@9.0.1 [[c136fda](https://github.com/segersniels/supdock/commit/c136fdae01f1bac7f630ef1321cd37fc6274b6a7)]

### Changed

- ⬆️ Bump lodash from 4.17.15 to 4.17.19 [[b1efca1](https://github.com/segersniels/supdock/commit/b1efca15f702777a29a33fa8ef7f24f34799b5ab)]
- ♻️ Move metadata back to src and add cat command [[8c85061](https://github.com/segersniels/supdock/commit/8c85061ee3ccba792a37492c071a8580952500bf)]
- 🎨 Drop const [[74d44bb](https://github.com/segersniels/supdock/commit/74d44bb706f359af35581ea6ae96f27f7e87c233)]
- ♻️ Use default export [[a57caa5](https://github.com/segersniels/supdock/commit/a57caa554ddb61aeabeb57f029ac3770de0c0d86)]
- 🎨 Simplify command creation and run [[4ccd535](https://github.com/segersniels/supdock/commit/4ccd5356424a4d9b5ece8e80bb8b3865ed506f29)]
- ⬆️ Bump deps [[6456c40](https://github.com/segersniels/supdock/commit/6456c406c992f47a07a91876b2166e4cda2bf321)]

### Fixed

- 🚑 Return when no choice [[b2c7be5](https://github.com/segersniels/supdock/commit/b2c7be5dfac1c2bdaefec536b1ea973e71a948b9)]


<a name="2.4.6"></a>
## 2.4.6 (2020-04-01)

### Added

- ✅ Clean up config after tests that use config [[851b1a8](https://github.com/segersniels/supdock/commit/851b1a8ce1405f90b1e0f5e271de51b406778d11)]
- ✨ Add helper function to delete config in test env [[44c3a37](https://github.com/segersniels/supdock/commit/44c3a37caaa269d0f2d8dd7119f3cb5d1da152f7)]
- ✅ Write config test to make sure migrations work [[9492172](https://github.com/segersniels/supdock/commit/94921728064ee24c4a23f9511a21625569587d29)]
- ✨ Add list to config [[7bb9a8f](https://github.com/segersniels/supdock/commit/7bb9a8fce435530effbb0c32faef5342c0188c65)]
- ✨ Allow config to be passed a default config [[e50b5ea](https://github.com/segersniels/supdock/commit/e50b5ea3e51226abd8c76ded43de67585623d543)]
- ✅ Disable caution check [[368cf95](https://github.com/segersniels/supdock/commit/368cf9543fe24848232abb0bb29241d1e9ee9f51)]
- ✅ Make sure we test fuzzy search behaviour [[9d4d2a6](https://github.com/segersniels/supdock/commit/9d4d2a6b53f48e94e22d3f8b9c1fc6c1740463a5)]
- ✅ Add stats test [[385e8ab](https://github.com/segersniels/supdock/commit/385e8ab44c59da215a2e19a58075a31a3dbbe5a5)]
- ✨ Add way to inject custom logic in run [[a90c235](https://github.com/segersniels/supdock/commit/a90c235849b75d4feaac689ce8812528ce4a0497)]
- ✨ Allow configuring if command should ask for a prompt in its default behaviour [[f0d52c1](https://github.com/segersniels/supdock/commit/f0d52c1607695442912bc96a66489f0f4e05c269)]

### Changed

- ⬆️ Bump deps [[b32bd80](https://github.com/segersniels/supdock/commit/b32bd80b267004234cded5e56bab1d6155b3bfe8)]
- 🔧 Move all deps to devDeps [[56a3dd1](https://github.com/segersniels/supdock/commit/56a3dd16edb29044b379a5a97f14a64df5dd7afc)]
- ♻️ Use configPath directly in config configuration [[eb7a1f2](https://github.com/segersniels/supdock/commit/eb7a1f27316c66c20223e672d0af5afb2db19004)]
- ♻️ Use helper function instead of having duplicate code [[de2037d](https://github.com/segersniels/supdock/commit/de2037d271d9dd51a17f8fe81cae6c6d1da7880b)]
- 🔧 Add .config dir to gitignore [[5e25acc](https://github.com/segersniels/supdock/commit/5e25accca637c6b7eb5dedf6b0427e820c2be1c0)]
- ♻️ Move types and interface directories where they belong [[444ab2c](https://github.com/segersniels/supdock/commit/444ab2c79205dd3ef69b80641ed21c0dbecb075e)]
- ⬆️ Upgrade configstore@5.0.1 [[e63eede](https://github.com/segersniels/supdock/commit/e63eede9ea2fd699dc894f81549870c51fcfd122)]
- ⬆️ Upgrade minimist@1.2.5 [[9184cb0](https://github.com/segersniels/supdock/commit/9184cb0340ba9ffecd26f7cd8a8edc36fd116cba)]
- 🎨 Move around functions for better readability [[f670692](https://github.com/segersniels/supdock/commit/f670692e83399add8a34b9b1ac6a62f85a68d45f)]
- ♻️ Move some code out of constructor [[4db94bb](https://github.com/segersniels/supdock/commit/4db94bbad37f0a914e42e65372b67a7c83fe4807)]
- 🎨 When testing add the nonFlags to the returned command [[a8dbb7a](https://github.com/segersniels/supdock/commit/a8dbb7a6bfaf0844f1b38e3bf5b87fd41aa6a46f)]
- 🎨 Make sure we return the defaulted command when testing so we can check behaviour [[f12c447](https://github.com/segersniels/supdock/commit/f12c447deb08e959d2ca3a714d0ace43d0061eaf)]
- 🎨 Rename init to inject [[630eea7](https://github.com/segersniels/supdock/commit/630eea777c88078d8893e8340bc5f140d4373364)]
- ♻️ Inject through init instead of modifying run [[beb0528](https://github.com/segersniels/supdock/commit/beb0528661b37a58fdc96f3ebaf74afafaf1995e)]
- ⚡ Split up run into separate blocks so customization per command is easier&quot; [[420c96e](https://github.com/segersniels/supdock/commit/420c96e8d133789786a2f60922141b8a351fa5c0)]
- ⚡ Split up run into separate blocks so customization per command is easier [[1c59113](https://github.com/segersniels/supdock/commit/1c591137e65988421728412dc17f1bce7db4bdc0)]

### Removed

- ➖ Remove @types/inquirer [[58df687](https://github.com/segersniels/supdock/commit/58df687bb11e968f8764996d9891e2a1146edaa4)]
- 🔥 Strip some of the old logic [[61a40ab](https://github.com/segersniels/supdock/commit/61a40ab6fd560b34ec1b9f6e62e9a9fe9c56afef)]

### Fixed

- 🐛 Stats wasn&#x27;t working entirely like it should have [[ee5869d](https://github.com/segersniels/supdock/commit/ee5869d785107a5494292c54ab62efd34c0258e1)]

### Miscellaneous

- 📝 Update readme [[5cceb08](https://github.com/segersniels/supdock/commit/5cceb08b3e09e3f72d2474a398160b02206ba73c)]


<a name="2.4.5"></a>
## 2.4.5 (2020-03-08)

### Added

- ➕ Add @zeit/ncc [[e4ca4d0](https://github.com/segersniels/supdock/commit/e4ca4d07f1ccd1cae28cd899ff7a778e8a3e9f01)]
- ✨ Also show image name in prompt in case container has an automated name [[854f4fb](https://github.com/segersniels/supdock/commit/854f4fb7c028ebf75509a26676caf2f270ed2baa)]
- ✨ Reintroduce error behaviour if no choices were able to be generated [[729562a](https://github.com/segersniels/supdock/commit/729562aa416beeae713f4072e648695694ad6ac5)]
- ✅ Adjust test now that prune info functionality has changed [[df59124](https://github.com/segersniels/supdock/commit/df591244c2c0422f50a3849fa90ef91cc63477bf)]

### Changed

- ⬆️ Bump deps [[5b53b93](https://github.com/segersniels/supdock/commit/5b53b935ffbd98767b674c759ee53c7fb0bddce6)]
- 🔧 Minify compiled code [[134363d](https://github.com/segersniels/supdock/commit/134363d85cf8a8bde9e58eabf65e6e6b9afbc0c2)]
- ⬆️ Bump deps [[9e1040b](https://github.com/segersniels/supdock/commit/9e1040b1f2b7ef51edf7f78370a084accbd5be72)]
- 🔧 Compile using ncc instead of tsc [[71b0a0e](https://github.com/segersniels/supdock/commit/71b0a0e7d2885d9f0a53391a2f6b997680b2f990)]
- ♻️ Extra check if string since we sometimes just return spawn response [[36b50ed](https://github.com/segersniels/supdock/commit/36b50edc7d0ffb90056569c8451c0765c9b71df5)]
- ♻️ Return instead of having an ugly exit [[a47665d](https://github.com/segersniels/supdock/commit/a47665db3dc6f53d70eacd8f4335b9cc2478d73b)]
- ♻️ Dont proceed with prune after info [[365dd36](https://github.com/segersniels/supdock/commit/365dd36810a99ef25a129c4bcc91bcea97abe23f)]

### Removed

- 🔥 Remove tsc compilation from lint [[498f322](https://github.com/segersniels/supdock/commit/498f322a180e8f9763610fcf75e05b5f1c0f5e18)]
- 🔥 Remove react from eslint config [[3d255cf](https://github.com/segersniels/supdock/commit/3d255cff39fd4525a4cd6b7a290c4f92e7368ff4)]
- 🔥 Remove babel config [[b7991df](https://github.com/segersniels/supdock/commit/b7991dfdab5d31ea295daf8c4bc16dcb17243b8f)]
- ➖ Remove eslint react plugins ; copy paste error [[ca8664a](https://github.com/segersniels/supdock/commit/ca8664a7ef83bc856daad425cc4257f29d67416f)]
- ➖ Drop babel dependency [[b99c5e7](https://github.com/segersniels/supdock/commit/b99c5e77276c983c8aa18af00f26dad197529c4c)]
- 🔥 Remove old testing behaviour which is no longer needed [[d3b43a8](https://github.com/segersniels/supdock/commit/d3b43a8fee3411a5676afc477c202c42fe0e35b9)]

### Miscellaneous

- 🏷️ Remove hard defined type since it now possibly returns the default spawnSync type [[808c7e4](https://github.com/segersniels/supdock/commit/808c7e45f8e1f4294c06fd95afa863f46d1babec)]


<a name="2.4.4"></a>
## 2.4.4 (2020-03-03)

### Added

- ➕ Add prompts@2.3.1 [[ee5ccbd](https://github.com/segersniels/supdock/commit/ee5ccbd4b6320ff92ccf002d9864b1e403562dd7)]

### Changed

- ⬆️ Bump deps [[3890498](https://github.com/segersniels/supdock/commit/389049818bc5bbfa1f4c78bc26b0cef7e88ffa0a)]
- ♻️ Use prompts instead of inquirer to reduce package size [[f53b9c1](https://github.com/segersniels/supdock/commit/f53b9c1f060c8d340eca1558880e608edf23a75e)]
- ♻️ Use internal prompt wherever needed [[7cb52ef](https://github.com/segersniels/supdock/commit/7cb52ef52cd647c3536bc341339929fdc5dda8e3)]
- 🔧 Include dist dir when publishing [[48e944b](https://github.com/segersniels/supdock/commit/48e944b98566c7f037794e87c9410dba7b45d9ea)]
- 🔧 Remove --skipLibCheck from tsc compiling [[92eb4fc](https://github.com/segersniels/supdock/commit/92eb4fc0d30ab34d4912a65bfe39b248afba3c07)]
- 🚨 Disable @typescript-eslint/no-non-null-assertion [[e28a24a](https://github.com/segersniels/supdock/commit/e28a24acb7bd0a3a281250e504d9db43af43fabc)]
- ⬆️ Chalk@3.0.0 [[0e66d30](https://github.com/segersniels/supdock/commit/0e66d307753aac6132056f0fda4e58e7c82e6575)]
- 🔧 Publish from root instead of dist [[cdfc921](https://github.com/segersniels/supdock/commit/cdfc92122b95a1135bfd806b2dc367a269c76a59)]

### Removed

- ➖ Remove inquirer [[600f0ad](https://github.com/segersniels/supdock/commit/600f0ad01765c77ecc9c0ac5462071e0cb3fc033)]

### Fixed

- ✏️ Typo [[c9fcf1b](https://github.com/segersniels/supdock/commit/c9fcf1b77814d7103326d6246c8398d0fe615073)]
- 💚 Add types&quot; [[f21a606](https://github.com/segersniels/supdock/commit/f21a6069e3e8d3cb54c629a471e4a93b7a40030f)]
- 💚 Add types [[99c947f](https://github.com/segersniels/supdock/commit/99c947fd2b37bfccbf536a3ef667198193ad90c6)]
- 💚 Now deloying from root instead of dist [[5237d60](https://github.com/segersniels/supdock/commit/5237d6005a33c6366c496e92bc3f1531d0ed19b3)]
- 💚 Check if on correct branch [[6eef055](https://github.com/segersniels/supdock/commit/6eef055d27d6a7b34930952b946fa4867ab6d1b7)]
- 💚 Only create a github release on master branch [[27fc112](https://github.com/segersniels/supdock/commit/27fc112693ebc32c00addf63912737f7cd744268)]
- 💚 Allow circle beta publishing [[40ba151](https://github.com/segersniels/supdock/commit/40ba15156a800f88b837d259378e65ca734fe41e)]

### Miscellaneous

- 📝 Move around parts a bit [[95101ee](https://github.com/segersniels/supdock/commit/95101ee84e3e217535cda94d8721c239ab8914fe)]
- 📝 Advice people to download binary for speed [[6157af0](https://github.com/segersniels/supdock/commit/6157af0b5041cb1787e5073fe2c6d8119df55c4d)]
- 📝 Adjust readme to say usage is not always up to date [[29626f8](https://github.com/segersniels/supdock/commit/29626f8474c8a12bafbb5b86afb6d1ef18aa9c59)]


<a name="2.4.3"></a>
## 2.4.3 (2020-02-29)

### Added

- ✅ Add simple usage test just to be sure it still executes without issues [[15aed73](https://github.com/segersniels/supdock/commit/15aed739cd83a47f3e8732d8b1b857077ea35ff7)]

### Fixed

- 🐛 Dont early return so custom description gets logged [[299de11](https://github.com/segersniels/supdock/commit/299de118122f4bf5483151fc9505324367a15ff1)]


<a name="2.4.2"></a>
## 2.4.2 (2020-02-29)

### Changed

- ⚡ Only import whatever is needed [[e1f29f3](https://github.com/segersniels/supdock/commit/e1f29f3ff92cf23afbb577b350d2639c3fac54ea)]

### Fixed

- 💚 Take supdock version as tag [[d33f25a](https://github.com/segersniels/supdock/commit/d33f25ac4fb3bd934c199009da1032891e6fa870)]

### Miscellaneous

- 📝 2.4.2 [[b8db62c](https://github.com/segersniels/supdock/commit/b8db62cd01e3f37c08246a7e40b82135852efb82)]


<a name="2.4.1"></a>
## 2.4.1 (2020-02-29)

### Changed

- 🔧 Move bin from inbetween dependencies [[628fe26](https://github.com/segersniels/supdock/commit/628fe269b447468a956a48f823f65e350c80b8d5)]
- 🔧 Add publish scripts [[cccbf9f](https://github.com/segersniels/supdock/commit/cccbf9f5b71ef93e260435f20fdb971c3982e123)]

### Fixed

- 🚑 Needed to work with npm/yarn [[c9d2561](https://github.com/segersniels/supdock/commit/c9d2561daf7e1124d8545f2faf2b5cd4dba8114b)]
- 💚 Publish with yarn [[b483b2a](https://github.com/segersniels/supdock/commit/b483b2a1e403d88120ad87bf53b7d15e695fafce)]

### Miscellaneous

- 📝 I fucked up version 2.4.0 [[a1e969a](https://github.com/segersniels/supdock/commit/a1e969a81d87abb1eb3eda4c3e4965a0fa330f2c)]


<a name="2.4.0"></a>
## 2.4.0 (2020-02-29)

### Added

- ✅ Test if short logs config changes the flags [[361063b](https://github.com/segersniels/supdock/commit/361063b0ea6c9018e1e2b3a31aa8d69153863b5c)]
- ✅ Add tests to see if supdock prompt commands execute [[74df02a](https://github.com/segersniels/supdock/commit/74df02a3853eebc946406fd72255fa5d98b2e3d3)]
- ✨ Allow mocking of nonFlags [[ef9368a](https://github.com/segersniels/supdock/commit/ef9368a08c727d871f61dc60b8814044c2d300f1)]
- ✨ Enable fuzzy searching of more commands [[cec372e](https://github.com/segersniels/supdock/commit/cec372e0439b98cbcacf0853e98d1a82aa49d5ed)]
- ✨ Add test helper [[e38d818](https://github.com/segersniels/supdock/commit/e38d8188597c8fb7849af5fd7a5d4afd9e1f0189)]
- ✅ Add tests [[1531541](https://github.com/segersniels/supdock/commit/153154154a870e94ce0cf909c88faaa20b07448d)]
- ➕ Add testing dependencies like mocha and chai [[c06e6a3](https://github.com/segersniels/supdock/commit/c06e6a35dd27a1e279997ab9d237246c8ec5a6bd)]
- ➕ Add babel and module resolving [[8e3cb25](https://github.com/segersniels/supdock/commit/8e3cb25b9a96146466e788b00ddaa548363b7caf)]
- ✨ Add top and port commands [[48bfc4a](https://github.com/segersniels/supdock/commit/48bfc4ad60b7f7aa1ced45033e52ac5c264cfdca)]
- ✨ Add info flag to see docker system df [[f9d3199](https://github.com/segersniels/supdock/commit/f9d31994d5c595c0973aa9c3cc44ccc934ff15d3)]
- ✨ allow passing of flags to no prompt commands [[8d4c327](https://github.com/segersniels/supdock/commit/8d4c327ea266760b747e18c37c5417f0cefbc239)]
- ✨ allow passing of flags to prune command [[8a3b480](https://github.com/segersniels/supdock/commit/8a3b4804f91428772c50d9a707680446c8595190)]
- 🔊 Basic changelog added [[b1d2aec](https://github.com/segersniels/supdock/commit/b1d2aecb6d03c40cc959f89cd7563d10b7971ffc)]

### Changed

- 🎨 Type execute as any to easily support mocking [[b8c5377](https://github.com/segersniels/supdock/commit/b8c5377cd442646e25e1a882bbdc64aa5113b3d1)]
- 🎨 Return ids so we can check which ones were restarted in tests [[9358980](https://github.com/segersniels/supdock/commit/935898025accbb0fbb2793f6d328d0617e25a1e3)]
- 🎨 Reduce to one line [[41a89c1](https://github.com/segersniels/supdock/commit/41a89c1ab143d5bea7ab20bb0ded1ec859b77a2d)]
- ♻️ Allow mocking of internal functions to allow testing [[1507a10](https://github.com/segersniels/supdock/commit/1507a106b37c7335f31955689f814cf73413811e)]
- ⬆️ Bump deps [[5fb0c90](https://github.com/segersniels/supdock/commit/5fb0c90af91e7e3caba1690428388dd24a2e9d5b)]
- 🔧 Clean up tsconfig [[72d50e7](https://github.com/segersniels/supdock/commit/72d50e74f89da248bfac7216ae8e34413d83990f)]
- 🔧 Add babel.config.js [[2949fd3](https://github.com/segersniels/supdock/commit/2949fd30b413707f134b17f5ff9c706c73ed405d)]
- 🔧 Split compiling and building [[9e9a554](https://github.com/segersniels/supdock/commit/9e9a554e2977399701e504356cce5991d74fd5e0)]
- ♻️ Switch to yarn [[17d3863](https://github.com/segersniels/supdock/commit/17d3863fbbde07545043028d9ccec4b9bb46da1e)]
- 🚚 Move metadata out of src [[a9c3af2](https://github.com/segersniels/supdock/commit/a9c3af287e251aae0afcd5a8c8cf211983bb113c)]
- 🔧 Add module resolution [[a3d1ad2](https://github.com/segersniels/supdock/commit/a3d1ad2f5191c6e1e78ec6fce472e6dbede7eb11)]
- ⬆️ Upgrade pkg@4.4.3 [[bddff03](https://github.com/segersniels/supdock/commit/bddff03a0d3b880618490ee1d3ab1f0fb573983f)]
- ⬆️ Upgrade @types/node [[af4da36](https://github.com/segersniels/supdock/commit/af4da36bf2df8f7c092471c31dd02e832750bc50)]
- 🎨 Fix lingering old github repo [[deb83bb](https://github.com/segersniels/supdock/commit/deb83bb52644d60a56cafa6d123863a7dec3adc8)]
- ⬆️ Bump deps [[250d35b](https://github.com/segersniels/supdock/commit/250d35b57eab4fbc1ccdc271b302e5ab7335bfb6)]
- ♻️ Clean up code [[3caf1d8](https://github.com/segersniels/supdock/commit/3caf1d8d07ad0334557ac6291aac5cfa92e954da)]

### Removed

- 🔥 No longer needed as this version of supdock is already way ahead of the golang one [[bbc0d5f](https://github.com/segersniels/supdock/commit/bbc0d5f409a6b9ecacdbac81c2e86c515513fd2a)]

### Fixed

- 🐛 Should use internal createChoices [[9f94578](https://github.com/segersniels/supdock/commit/9f945781cd8e4de017ec0879a7555c4c5e4f39b0)]
- 🐛 Extend internals even when not mocking [[29cc2e5](https://github.com/segersniels/supdock/commit/29cc2e57f2b9e1312748c97c28a9221e55159406)]
- 🐛 Make sure nonFlags arent pushed twice [[b3201d5](https://github.com/segersniels/supdock/commit/b3201d5706963e0a1eef629919f606983c582bc2)]
- 💚 Run tests on CI [[d1e0eec](https://github.com/segersniels/supdock/commit/d1e0eec5d56c255d864c6fef4817eba03a1138d0)]
- 💚 Specify targets [[08c26cf](https://github.com/segersniels/supdock/commit/08c26cf28f5d0106028daa3bd7813b102b38eeae)]
- 💚 Lingering npm [[70442c8](https://github.com/segersniels/supdock/commit/70442c823080557e03b30e931d2a12891ed11012)]
- 💚 Adjust CI to match new scripts [[1682e6e](https://github.com/segersniels/supdock/commit/1682e6eb8a00e81f739a563490e0bd365342c378)]
- 🐛 Comment out return [[f5018fc](https://github.com/segersniels/supdock/commit/f5018fc6f182cb1385b3246072f2c1dcbaa9f228)]

### Miscellaneous

- 📝 Add changelog for 2.4.0 [[4d2cab0](https://github.com/segersniels/supdock/commit/4d2cab0f5321c8f5056f61cfd96207ad41b196f5)]
- 📝 Ci badge was still pointing to old repo [[9bdc2e7](https://github.com/segersniels/supdock/commit/9bdc2e71a3296ed457a398c5b73b9a249529705b)]
- 🏷️ fix flags typing [[6259645](https://github.com/segersniels/supdock/commit/62596458962bbd40553026e4a47f93d6b784e4d2)]
- 📝 Adjust config in readme [[921eefc](https://github.com/segersniels/supdock/commit/921eefc005284b7762a42f738f6c67bc5452c37e)]


<a name="2.3.0"></a>
## 2.3.0 (2020-01-02)

### Added

- 🔊 Be more detailed when showing supdock flags [[84bfd1c](https://github.com/segersniels/supdock/commit/84bfd1cb0cf34bb57cf58d991c0bd9c70e6d6b33)]
- ✨ Add ConfigOptions enum [[2a28714](https://github.com/segersniels/supdock/commit/2a28714746144496e4080c904094d66dd6743b33)]
- ✨ Add config option to enforce line limit of logs command [[38b722b](https://github.com/segersniels/supdock/commit/38b722bc959e9c94ec5818efeaa20cb77d6f3333)]

### Changed

- ⬆️ Make sure package-lock is up to date [[0b1956c](https://github.com/segersniels/supdock/commit/0b1956c4d3b733042cbc7925cda2e13b34f7aa56)]
- ⬆️ Upgrade dev deps [[d153817](https://github.com/segersniels/supdock/commit/d1538176c84ea68b559830611bdd6df8b193f1ef)]
- ⬆️ Fuzzy-search@3.0.2 [[14a2cfd](https://github.com/segersniels/supdock/commit/14a2cfd6eb3f582b92bca932ff4252c46cfcbf23)]
- 📌 Pin pkg to node 12 [[a7e67ec](https://github.com/segersniels/supdock/commit/a7e67ec742c8dbc0743a47240177d8deaabb0283)]
- ♻️ Optimise internal config usage and make sure we can retain backwards compatibilty on updates [[591106f](https://github.com/segersniels/supdock/commit/591106f79c3050d3d869ee288b1054de50d09b74)]
- ♻️ Misplaced export [[a918d77](https://github.com/segersniels/supdock/commit/a918d7797ab6820e51ea4f7896ff4634628268f9)]
- ⚡ Use node12 [[4e1d210](https://github.com/segersniels/supdock/commit/4e1d21057bd7948bdbad3e6f2fb79db532ee5d39)]
- ⬆️ 4.4.2 pkg [[e3639d5](https://github.com/segersniels/supdock/commit/e3639d55b9d6ea983ca770a2128bbf3888a3ff56)]
- ♻️ Clean and split up code for better readability [[3eedd33](https://github.com/segersniels/supdock/commit/3eedd33380e5b04e8072f91546767a0201427a1c)]
- 🚨 Drop standard again and use eslint typescript linting with prettier [[f2b73fb](https://github.com/segersniels/supdock/commit/f2b73fb5ff11ae73598f3261d477724148b2b0bd)]
- 🚨 Linting + esModuleInterop [[8295006](https://github.com/segersniels/supdock/commit/8295006ff1a1bd7f683ba29edd70ff06506d0cfd)]

### Removed

- 🔥 Unpin pkg to node12, doesn&#x27;t seem to work as expected... [[d7e2c30](https://github.com/segersniels/supdock/commit/d7e2c307152ccb6bd1e1c72f7f5d0b046018af0e)]
- 🔥 Remove eslint disable lines [[c682302](https://github.com/segersniels/supdock/commit/c6823024d47202a4be8b0ad66f09b1b87f58725e)]

### Fixed

- 🚑 Dont exit early here [[85b8655](https://github.com/segersniels/supdock/commit/85b86553d3163f9ecbd00776869001420b316b06)]
- 🚑 Make sure we execute after switch break [[99d1e00](https://github.com/segersniels/supdock/commit/99d1e00c498f60d080b0a97ee276b701fff445a8)]
- 🚑 EsModuleInterop lingering change [[d359444](https://github.com/segersniels/supdock/commit/d359444df4e4fed8587686f5297e1138a1cc32f2)]
- 🐛 Make sure options is not undefined [[76b8d22](https://github.com/segersniels/supdock/commit/76b8d2242995074ea8875f2f5c3e50f2404362a7)]


<a name="2.2.7"></a>
## 2.2.7 (2019-11-05)

### Changed

- 🎨 Type config.get return as boolean [[b75a800](https://github.com/segersniels/supdock/commit/b75a800b673cf4f43d8bcf4131919880fe5a4666)]
- 🎨 For now only allow booleans [[6ddfda0](https://github.com/segersniels/supdock/commit/6ddfda0f7460ebbac9249d6293c79b52631c166c)]

### Fixed

- 🚑 Should only show version when no command is run [[314cfc4](https://github.com/segersniels/supdock/commit/314cfc424468d39ac007524050e01faaac374724)]


<a name="2.2.6"></a>
## 2.2.6 (2019-09-12)

### Changed

- ⚡ Use configstore package to handle configuration [[87a81f9](https://github.com/segersniels/supdock/commit/87a81f909eeadf2ea44b13f84a9e8219da5fe6e2)]


<a name="2.2.5"></a>
## 2.2.5 (2019-09-11)

### Added

- ➕ Add debug package for easier stack tracing logging [[5e4d6a5](https://github.com/segersniels/supdock/commit/5e4d6a567b3f373697aa11895cdb099ddfc66d6d)]

### Changed

- ⚡ Improve tracing of functions [[24fb423](https://github.com/segersniels/supdock/commit/24fb4237232381d815e9c06882a46b46c0521d7f)]

### Removed

- ➖ Remove manakin dependency [[00397af](https://github.com/segersniels/supdock/commit/00397af09d8ad5eb374a9b8366a404ef5872544b)]

### Fixed

- 🐛 Dont pass custom commands to default [[1c06fe5](https://github.com/segersniels/supdock/commit/1c06fe5cee51f5c94dda0438287c047e9f7d3fdb)]


<a name="2.2.3"></a>
## 2.2.3 (2019-09-04)

### Fixed

- 🚑 Make sure we create the parent dir first before trying to write the config file [[80156de](https://github.com/segersniels/supdock/commit/80156dee12ecae15897904947d98c1a4b498eb64)]


<a name="2.2.2"></a>
## 2.2.2 (2019-09-04)

### Fixed

- 🚑 Make sure we dont read flags of undefined [[a7daa80](https://github.com/segersniels/supdock/commit/a7daa80b4c8c6eb93f68088ff60d9356ed50b591)]

### Miscellaneous

- 📝 Shift around config file location [[8916586](https://github.com/segersniels/supdock/commit/8916586200364124502eb7148b8593e7b4e7cf00)]
- 📝 Adjust config enable or disable [[927e492](https://github.com/segersniels/supdock/commit/927e4925bf244f5ac8af7069f419f28940ea730b)]
- 📝 Rename docker to supdock [[da8e185](https://github.com/segersniels/supdock/commit/da8e185c490b223bf98b3d33d4f41f68cf8a25ab)]
- 📝 Move supdock enable usage below [[69f2dee](https://github.com/segersniels/supdock/commit/69f2dee61a5f182aa6e2297ac57dfc467359c559)]
- 📝 Add configuration section to readme [[08d530b](https://github.com/segersniels/supdock/commit/08d530b1a69a023d22c7388725e10b94a6967621)]


<a name="2.2.1"></a>
## 2.2.1 (2019-09-04)

### Fixed

- 🚑 Correctly check if config variable doesnt exist not just if false or true... [[9300fee](https://github.com/segersniels/supdock/commit/9300fee11abf3bbf8e60f6813bde7ad22e1754e1)]


<a name="2.2.0"></a>
## 2.2.0 (2019-09-04)

### Added

- ✨ Add the option to add a description to a configuration key [[6df9423](https://github.com/segersniels/supdock/commit/6df94235bc52b115ccadfe024b8f0ee79e69f057)]
- ✨ Add local makefile to make rebasing less of a hassle [[a4faa3a](https://github.com/segersniels/supdock/commit/a4faa3a5ecbd0506377d8f6647494d7fe7ebce62)]

### Changed

- ⚡ Make sure we default fuzzy searching to false so we dont break existing behaviour for people [[e977a5e](https://github.com/segersniels/supdock/commit/e977a5e5c35465bb278cfcfa5d87d9cdfa9b48b4)]
- ⚡ Optimise fuzzy searching and allow disabling + config optimise [[e114f35](https://github.com/segersniels/supdock/commit/e114f35ffc7e4a0db19ab14d1ac7906971a2d383)]
- ⚡ Change some of the process.exit behaviours to returns [[2a6d03a](https://github.com/segersniels/supdock/commit/2a6d03a448410ed89e91db800e45cbe98b2dbb20)]


<a name="2.2.4-rc.1"></a>
## 2.2.4-rc.1 (2019-09-10)

### Added

- ✨ Add the traceFunction decorator to supdock class [[dfafaf9](https://github.com/segersniels/supdock/commit/dfafaf9057962e61b2aedb51359c21612f86d788)]
- ➕ Install manakin for colored trace [[29a7a7b](https://github.com/segersniels/supdock/commit/29a7a7b0fcb48f8d83519f9adeee6d23c48c121d)]
- ✨ Add a traceFunction decorator to trace specific functions [[2fb448c](https://github.com/segersniels/supdock/commit/2fb448c36eae9cd4d5d32ff7e30e0743195ac103)]

### Changed

- 🎨 Clean up tsconfig [[b1ed292](https://github.com/segersniels/supdock/commit/b1ed2926f2e27df8462c4cf942a4cd29f0e33eb2)]
- ⚡ Clean up code, make it more readable and make sure we improve checking for edge cases [[58fb913](https://github.com/segersniels/supdock/commit/58fb913ad59501c45470fec40dce1fa9fc419ee4)]

### Fixed

- 🚑 Fix stop command not correctly executing [[ffa1570](https://github.com/segersniels/supdock/commit/ffa1570f39b806c4a0f79deb77e3f9bfe8c4bfec)]

### Miscellaneous

-  Update README.md [[221663d](https://github.com/segersniels/supdock/commit/221663dcb5144984a5c564360fa2e73d819964b7)]


<a name="2.2.0-rc.6"></a>
## 2.2.0-rc.6 (2019-09-04)

### Fixed

- 🚑 Only add to nonFlags when not boolean [[eea30a9](https://github.com/segersniels/supdock/commit/eea30a9b72be722dfc6c7c394f204b452c4621ac)]


<a name="2.2.0-rc.5"></a>
## 2.2.0-rc.5 (2019-09-03)

### Fixed

- 🚑 I urgently need tests to prevent stuff like this from happening [[58cfefe](https://github.com/segersniels/supdock/commit/58cfefe1e7bee0991f7cfeed0b7afb4492e7741c)]


<a name="2.2.0-rc.4"></a>
## 2.2.0-rc.4 (2019-09-03)

### Changed

- ⚡ General optimization for flag parsing and how we handle nonFlags [[1aed677](https://github.com/segersniels/supdock/commit/1aed677df11ccde1477f81c7b10a00fea462ff0a)]

### Fixed

- 🚑 Fuck my life fix the rc and bump [[bb73dcd](https://github.com/segersniels/supdock/commit/bb73dcddfd50115627ef88b0db86c480007bebad)]
- 🚑 Make sure we parse flags correctly 💩 [[0ee69b8](https://github.com/segersniels/supdock/commit/0ee69b84175783033b27904d6c79b585d0ebc060)]


<a name="2.2.0-rc.2"></a>
## 2.2.0-rc.2 (2019-09-03)

### Changed

- 🎨 Make sure custom commands have more consistent usage help compared to default commands [[1042e2a](https://github.com/segersniels/supdock/commit/1042e2ae4d598e5828f5f263c0772c6b87402468)]


<a name="2.2.0-rc.1"></a>
## 2.2.0-rc.1 (2019-09-03)

### Added

- ✨ Allow users to adjust a local config file when fuzzy searching [[72fd24f](https://github.com/segersniels/supdock/commit/72fd24f87332d2dcbcfeb91c952b5632aa4c74c9)]
- ✨ Add new config helper [[5e783ff](https://github.com/segersniels/supdock/commit/5e783ff45a79fdc8df63e15a9874bf04cc1d3ba1)]
- ✨ Allow basic fuzzy searching for some commands [[6a1794c](https://github.com/segersniels/supdock/commit/6a1794ce8defafd62c8421ecc43778b8430a0e92)]

### Changed

- ⚡ Add more ways how we can optimise custom command usages [[1e0e54c](https://github.com/segersniels/supdock/commit/1e0e54c102be134934204ef0a004dd46ceb0746c)]
- 🚨 Screw standardx and just use standard from now on for consistent styling and linting [[6092d21](https://github.com/segersniels/supdock/commit/6092d21579d314e17de843aed079eb9093600ac0)]
- ⚡ Type things and split up code to make it more readable [[876c899](https://github.com/segersniels/supdock/commit/876c899de169b836d381e5e82741bb11f05484c1)]
- 🎨 No need to append Interface when typing [[896b0f4](https://github.com/segersniels/supdock/commit/896b0f4321fe68372bdeb103a8c4516c32a2b930)]
- 🎨 Constistent naming for enum [[cfc3085](https://github.com/segersniels/supdock/commit/cfc3085d5a460ee8b44358a5acc461fc527d9da4)]
- ⚡ Add typing to metadata commands so I can easily control what is required [[0d66f51](https://github.com/segersniels/supdock/commit/0d66f511b373f83a9cf5b95e3a7be322e05de103)]
- 🎨 Type should be of type CommandAlias [[6c649db](https://github.com/segersniels/supdock/commit/6c649db4f85356028a92a489c90e9bf21b23b51d)]
- 🎨 Move metadata to own directory under index.ts [[4bbb614](https://github.com/segersniels/supdock/commit/4bbb614754bfceca407f04b79d46df09335fa70e)]
- 🎨 Make things cleaner and provide an interface to use for Command [[c258456](https://github.com/segersniels/supdock/commit/c258456f89432dbbc58e8d19e203420bced693a7)]
- ⚡ Optimize standardx linting cause it&#x27;s being a bitch for some reason [[c3ae28f](https://github.com/segersniels/supdock/commit/c3ae28f3edcf0574aee9d391bc6d9861d87ed791)]
- 🚨 Adjust linter [[12811be](https://github.com/segersniels/supdock/commit/12811be7a5234bb9bb9834f33e226628a0314286)]
- 🚨 Tweaked standardx a little [[648a6bf](https://github.com/segersniels/supdock/commit/648a6bff819a2141d120a466d2b7f5375005cb12)]
- 🎨 Make sure we don&#x27;t fail a build on a failed publish [[4c56871](https://github.com/segersniels/supdock/commit/4c568718bd4f11371d9bfa3f83332214070191e3)]
- ⬆️ Bump lodash from 4.17.11 to 4.17.14 [[42fd937](https://github.com/segersniels/supdock/commit/42fd937246402adb0a2fa38e8390d766a3bfa3b5)]
- 🚨 Switch over from prettier, tslint and others to standardx [[1b1819f](https://github.com/segersniels/supdock/commit/1b1819fdad38805176be59b135941c0aaa877338)]

### Removed

- 🔥 Dont need this config line [[815719e](https://github.com/segersniels/supdock/commit/815719e481e1982e8abebafc91ff3e774672d339)]

### Fixed

- 🚑 Make sure we check on correct error and not on the function [[58c2092](https://github.com/segersniels/supdock/commit/58c2092882aabc229d9a3f65924f5afe2e76b136)]
- 🚑 Fix weird caching issue with circleci [[4621e0a](https://github.com/segersniels/supdock/commit/4621e0a08ba7161fc7d2b07e719a38bcf81eea91)]
- 🚑 Fix broken interface import [[ed7d5b9](https://github.com/segersniels/supdock/commit/ed7d5b96c44f88f6103625c17141157f54ca9c5b)]
- 💚 Add linting to ci [[a01e6b8](https://github.com/segersniels/supdock/commit/a01e6b8ae1eed9f52a26745013950025deb0d9b2)]
- 🚑 Fix master and origin differences because I fucked up [[71af6eb](https://github.com/segersniels/supdock/commit/71af6eb15562cf4a6bd34b0da6f3eec57ccb9eca)]


<a name="2.1.2"></a>
## 2.1.2 (2019-06-25)

### Added

- ✨ Allow for custom messages per command in case something is worth noticing [[03db533](https://github.com/segersniels/supdock/commit/03db533f96d67132cacded3f89e400a5a0c72203)]

### Changed

- 🎨 Reorganise some private functions for readability [[9ce02c9](https://github.com/segersniels/supdock/commit/9ce02c9c4540e7c74fd141e4e7776ed4fa5ace26)]
- 🎨 Split up command usage to private function for readability [[dab6018](https://github.com/segersniels/supdock/commit/dab60188530758e397f726729d401a92367d2069)]
- 🎨 Whitespace [[0b66fe7](https://github.com/segersniels/supdock/commit/0b66fe70ebe6c6fd01282fef503e3ac57c892dec)]
- 🎨 Move special prune spawn out of run to execute [[0bb9b4e](https://github.com/segersniels/supdock/commit/0bb9b4e629730d4468382e1fb8472ca81abf5802)]

### Miscellaneous

- 🚀 2.1.2 [[ee46172](https://github.com/segersniels/supdock/commit/ee46172ef712ed08d6cc98e20d1762427a691e4e)]


<a name="2.1.1"></a>
## 2.1.1 (2019-06-04)

### Added

- ✨ Quick fix to get prune command working again [[19d66bf](https://github.com/segersniels/supdock/commit/19d66bf6eed530ff33a5c360b86be4a4f265878a)]
- ✨ Add extra flags to logs command [[662f4ff](https://github.com/segersniels/supdock/commit/662f4ffe43c56ad0ac6b63b1c2aa1f3f4d75278e)]

### Changed

- ⚡ Add typescript check to circleci [[01a39cd](https://github.com/segersniels/supdock/commit/01a39cdcc1fa68a672d372dbd8f6c4092c6d05c9)]
- ⚡ Optimize prompt choice generation [[7539f95](https://github.com/segersniels/supdock/commit/7539f95cd20d57de841429cd6c8f103000791276)]
- ⚡ Refrain from using too many special extra shell commands to get ids [[cc5b2b0](https://github.com/segersniels/supdock/commit/cc5b2b08401d519f1104dd882fc511735e785747)]
- ⚡ Strip --prompt flag and fix minimist --no-&lt;flag&gt; parsing [[fe2f016](https://github.com/segersniels/supdock/commit/fe2f016f8f3612f121a750531e8af97499946f8d)]
- ⚡ Add a couple of extra flags to commands and don&#x27;t pass the dashes in metadata [[a4c89ea](https://github.com/segersniels/supdock/commit/a4c89eae969b9a4e874483dbdc4562bedb4ad81f)]
- ⚡ Allow custom flags with only a long notation [[6eab9d8](https://github.com/segersniels/supdock/commit/6eab9d84448035c27312982d748f6af1c12ebcd3)]
- 🎨 Replace Custom with Prompt Enabled flags in usage [[fb4067a](https://github.com/segersniels/supdock/commit/fb4067a809f132e16711378b9fd4c3cee581d314)]
- 🎨 Rename built index-* files to supdock-* [[50f19db](https://github.com/segersniels/supdock/commit/50f19dba6ae60f75978ae41e4914d8898c74ebf8)]
- 💄 Add chalk for some colors in logging [[c72d4e2](https://github.com/segersniels/supdock/commit/c72d4e215868882ac293ee387b71027b9e6bc52f)]
- 🎨 Use this.prompt for ssh extra prompt [[310e294](https://github.com/segersniels/supdock/commit/310e294db74f470e8c384c8a1df80b39a522ea84)]
- 🎨 Just to clean up any linting errors await inquirer for ssh [[7898b1b](https://github.com/segersniels/supdock/commit/7898b1b1d1ed17e8be5570126cbfa91e9d58532d)]
- ⚡ Only deploy on master branch [[dd19245](https://github.com/segersniels/supdock/commit/dd19245fdc22e0fbc079540e8a57c1b1ad9d78fb)]

### Removed

- 🔥 Skip the ghr errors [[7fd22ae](https://github.com/segersniels/supdock/commit/7fd22ae843865c38216900a14596a51c33830fd3)]
- 🔥 Dont fall back to previous chache if checksum fails [[e5f6e7d](https://github.com/segersniels/supdock/commit/e5f6e7d255c1c051688c692c9aa8bf3a6748289f)]
- 🔥 Remove skipping of errors now that only master branch deploys [[e611d32](https://github.com/segersniels/supdock/commit/e611d321e419caf455b56f2a4ae0028fb78bef80)]
- ➖ Remove commander dependency [[46416f7](https://github.com/segersniels/supdock/commit/46416f74b9a330b6f194cd27a444b24c860cf20b)]

### Fixed

- 🚑 Circleci checkout first [[3a2a398](https://github.com/segersniels/supdock/commit/3a2a3984aafa9bd90d248f06c806dd05a281d92e)]
- 🐛 Correctly indent flags with only long notation [[020168d](https://github.com/segersniels/supdock/commit/020168d59b4d4d4648b015503008d604443d4c21)]
- 💚 Check if errors can be skipped [[1df09e3](https://github.com/segersniels/supdock/commit/1df09e32af19cd4b166ff4611931bd28ab371e67)]

### Miscellaneous

- 🚀 Version 2.1.1 [[4e7116f](https://github.com/segersniels/supdock/commit/4e7116fdf0ed64eb5e7dec93c199f619e66e752e)]
-  Merge pull request [#4](https://github.com/segersniels/supdock/issues/4) from segersniels/master [[272cd45](https://github.com/segersniels/supdock/commit/272cd455dafcb479a3ffc599860668fc3e03cf85)]
- 🚀 Version 2.1.0 [[9c8a18b](https://github.com/segersniels/supdock/commit/9c8a18b7eb7b0d1df1dcc62e0d25fc3096c08ae5)]
- 📝 Rename custom supdock usage options [[dd081bc](https://github.com/segersniels/supdock/commit/dd081bcbae39494f1a66633a475adb378396d71b)]
- 📝 Chance circle badge to master branch [[08ee946](https://github.com/segersniels/supdock/commit/08ee946aa558298b5e3b8a7c7d6a62832b6623f4)]
- 📝 Adjust readme to mv supdock instead of index [[05232b7](https://github.com/segersniels/supdock/commit/05232b7bad48075a6ff73cc22c1d2f08b66575bc)]


<a name="2.0.7"></a>
## 2.0.7 (2019-05-24)

### Fixed

- 🚑 Return early when defaulting [[b80c4f3](https://github.com/segersniels/supdock/commit/b80c4f3773b969ef1f9fd03c5556742e37fa1690)]

### Miscellaneous

- 📝 Add chmod step to binary install [[e300e50](https://github.com/segersniels/supdock/commit/e300e50b2cf9daaa895e92d2f92b384d8441a81d)]


<a name="2.0.6"></a>
## 2.0.6 (2019-05-23)

### Miscellaneous

- 📝 Adjust usage to not show version number [[bf26251](https://github.com/segersniels/supdock/commit/bf2625156c6e6fd9c5cdedf5959ae77556c0dc96)]
- 📝 Make sure readme is available in dist directory before publishing [[22da6a9](https://github.com/segersniels/supdock/commit/22da6a9318c590190fae3805225cb3684b3aa9fd)]


<a name="2.0.5"></a>
## 2.0.5 (2019-05-23)

### Changed

- 🎨 ExecuteInParallel shouldnt be public anymore [[8bcffac](https://github.com/segersniels/supdock/commit/8bcfface223afa841d7e975a593d8605df55febf)]
- 🚨 Minor linting stuff [[0a54370](https://github.com/segersniels/supdock/commit/0a54370905e2a8705befda651e57e8938559e107)]
- ⚡ Allow calling on the Default enum to get Type to pass to execute [[4d16b40](https://github.com/segersniels/supdock/commit/4d16b401797b84160cb32be46c3decc25d2c40b5)]
- ⚡ Simplify and restructure code base for easier readability and maintenance [[c2fad72](https://github.com/segersniels/supdock/commit/c2fad724a3dd30b5c14cc123e0834b1fe833458e)]

### Fixed

- 🚑 Fix flag generation of unknown command [[b6af166](https://github.com/segersniels/supdock/commit/b6af166ea93a07edd89085c0875069ebf017f3da)]


<a name="2.0.4"></a>
## 2.0.4 (2019-05-23)

### Removed

- 🔥 Remove go link from ts readme [[7ce6d6c](https://github.com/segersniels/supdock/commit/7ce6d6cb0394dfa35ae98f10ef9ff76fc41b6b64)]

### Fixed

- 🚑 Fix mapping of flags if no flags defined [[3001c43](https://github.com/segersniels/supdock/commit/3001c43b7b9c819a33ee084bd985a18e462042dc)]

### Miscellaneous

- 📝 Adjust the rework readme part [[2139db3](https://github.com/segersniels/supdock/commit/2139db306f335c6c8a2f62e18aaca1d0eada7146)]
- 📝 Fix readme [[a7766e5](https://github.com/segersniels/supdock/commit/a7766e5eab6c1dd1e5fab16f9b0da19022008944)]
- 📝 Readme fix [[fc589b4](https://github.com/segersniels/supdock/commit/fc589b43e9697bcf6740e962f79f68e6abebaf6a)]
- 📝 Lint docs + remove commander issue + update usage [[c9c6c02](https://github.com/segersniels/supdock/commit/c9c6c02702ae3a8d1def46627c8b6363a55984bd)]


<a name="2.0.3"></a>
## 2.0.3 (2019-05-23)

### Fixed

- 🚑 Fix duplicate defaulting [[f7bc255](https://github.com/segersniels/supdock/commit/f7bc255fc6b622e8f1ca296d41543618bccd66a4)]

### Miscellaneous

- 📝 Add binary install instructions [[5589c7a](https://github.com/segersniels/supdock/commit/5589c7a8378cc963aeefcafc4bb7b16074ac714d)]
- 📝 Add comment above switch case for later remidner [[ad978d0](https://github.com/segersniels/supdock/commit/ad978d09eedc8c075b9ba41bc773ab90427f97e5)]


<a name="2.0.2"></a>
## 2.0.2 (2019-05-23)

### Fixed

- 🚑 Rename bin to correct binary [[3ab7795](https://github.com/segersniels/supdock/commit/3ab7795e6b573563f1464235552b6860d29c167b)]
- 💚 Fix npm publishing [[ee1c93b](https://github.com/segersniels/supdock/commit/ee1c93b1ac6478c41c5578804ab4a2afd119f0fd)]


<a name="2.0.0"></a>
## 2.0.0 (2019-05-23)

### Added

- ✨ Add flag generation from metadata when calling -h on command [[2b52c87](https://github.com/segersniels/supdock/commit/2b52c871367f023506d5b3fb3812f631507697a2)]
- ✨ Start of typescript rework [[e0028c8](https://github.com/segersniels/supdock/commit/e0028c85209f84d32421b233b925ede5014c5b00)]

### Changed

- 🎨 Remove changelog badge and replace with circleci [[bfe5e52](https://github.com/segersniels/supdock/commit/bfe5e52a42b71c59ce444776ff45a4bc9f53c504)]
- ⚡ Compile to dist and pkg to bin [[07d6e93](https://github.com/segersniels/supdock/commit/07d6e930d36f5d2c30851f4d8c5aff9ada18944b)]
- 🚨 Add tslint.json [[aa16be0](https://github.com/segersniels/supdock/commit/aa16be0719d818d3aa78cf6259e734d8af8b303f)]
- 🚨 Change eslint to tslint [[5b01cdb](https://github.com/segersniels/supdock/commit/5b01cdb4131d8529169c9ca920f5884719591ca1)]
- ⚡ Makes things easier for CI deployment if version outputs only the number [[58bb6b2](https://github.com/segersniels/supdock/commit/58bb6b2a981dc32df7b48eadefe8ba35324bc11f)]
- 🎨 Add logging when detached parallel execution is happening [[aa38d2f](https://github.com/segersniels/supdock/commit/aa38d2f6a159642d6aa6cb1edc0cbd05bdffa548)]
- ⚡ Spawn instead of spawnsync [[1a04c54](https://github.com/segersniels/supdock/commit/1a04c5404baef868317aa04083d0439eae562221)]
- ⚡ Move metadata to external file [[f6c0288](https://github.com/segersniels/supdock/commit/f6c02880a846c139e2f0fcded19cdd5cc09691e3)]
- ⚡ Drop commander for ux reasons [[cc1aca8](https://github.com/segersniels/supdock/commit/cc1aca8e1ac6a48f3ca294739c2a23e568736717)]
- ⚡ Merge getNames and getIds in 1 function [[d4fdff4](https://github.com/segersniels/supdock/commit/d4fdff476edd9ab4b15c8a92df9ea772cd0d71b6)]
- 🎨 Rename supdock to index.ts [[6b55342](https://github.com/segersniels/supdock/commit/6b55342d3cb544312d6bf30b31ea3bcdeef6e766)]
- ⚡ Move enums and types to own dir [[c4aa39e](https://github.com/segersniels/supdock/commit/c4aa39ecd8a7ee44e4ff80dfe168deeebb12453a)]
- 🎨 Rename passthrough to default [[3d69a65](https://github.com/segersniels/supdock/commit/3d69a6524b9ab2438740808fb665cc8e1690ec1b)]
- ⚡ Rename supdock.ts to index.ts [[9b5e8c4](https://github.com/segersniels/supdock/commit/9b5e8c417a3fb82c9b8e7dad31e3baaf05afb7a6)]
- ⚡ Restrict getNames to only values [[d91f810](https://github.com/segersniels/supdock/commit/d91f8100e8144c95ac08cd0df23d9ee5a4470c6f)]
- ⚡ Move enum to separate dir [[8daae29](https://github.com/segersniels/supdock/commit/8daae292322da93dcc9058d11ffeeb1285824921)]

### Removed

- 🔥 No need for Makefile [[c8d923b](https://github.com/segersniels/supdock/commit/c8d923bf0df0c3a1a9fcdc8ff0642ad3aa3ff2c1)]
- 🔥 Delete bin from remote [[95a1bb2](https://github.com/segersniels/supdock/commit/95a1bb29796d889430941c876cf7030e211a1f35)]
- 🔥 Bin can be ignored [[83ad461](https://github.com/segersniels/supdock/commit/83ad4610a1e6654d95283e7697005d88801d7c66)]

### Fixed

- 🚑 Publish from dist [[46e6462](https://github.com/segersniels/supdock/commit/46e6462fc15766fb828278b1afac72aa93e9803f)]
- 💚 Recreate and replace release [[07826b1](https://github.com/segersniels/supdock/commit/07826b153247c5cbeb15e4385bea0b2c168cb897)]
- 🚑 Fix npmrc auth [[30dd6f0](https://github.com/segersniels/supdock/commit/30dd6f082b3c8468150f93e008dc5f2b26cb2f51)]
- 🚑 Change lingering old to ts renamings [[1577f3c](https://github.com/segersniels/supdock/commit/1577f3cb7d5b809c4bb98a9dce068716b5a42063)]
- 🚑 Npm run build:ci [[5f58b39](https://github.com/segersniels/supdock/commit/5f58b390088d48d6e049443656ebd38fb9994447)]
- 💚 Experimental github release for pkg binary [[2854309](https://github.com/segersniels/supdock/commit/2854309e817673cef8bb1eb073fb3a83c1b751f7)]

### Miscellaneous

- 📝 Adjust deprecated message [[f616d63](https://github.com/segersniels/supdock/commit/f616d630eda90765c0886cc6cd178b90ced5d476)]
-  Merge pull request [#1](https://github.com/segersniels/supdock/issues/1) from segersniels/feature/typescript [[2d99d58](https://github.com/segersniels/supdock/commit/2d99d582e87f13dc2fbbdc3661c93d7791521143)]
- 📝 Add comment to explain what promptEnabled means [[9dd81b6](https://github.com/segersniels/supdock/commit/9dd81b6a231725e8c792813cf26c04a9d86e7113)]
- 📦 Update pkg [[7cb05de](https://github.com/segersniels/supdock/commit/7cb05de2d7864b8608831f530a7f1feff8b1b61c)]
-  Update README.md [[268b4f3](https://github.com/segersniels/supdock/commit/268b4f3eec69ec6c434928037a606cd08165ba01)]
-  add changelog &amp; badges [[c870bff](https://github.com/segersniels/supdock/commit/c870bff6f043849f99f305de9c57992775cbe642)]
-  bump version [[e6b2186](https://github.com/segersniels/supdock/commit/e6b218647120ab8eba2786756066fea127bef034)]
-  Update README.md [[a3b69cc](https://github.com/segersniels/supdock/commit/a3b69cc5436d4949f8736087a117d2799e5828ef)]
-  Update README.md [[d6edf04](https://github.com/segersniels/supdock/commit/d6edf04473e9d3aacc1527fcf69a9ac21a8fff5f)]
-  add inspect command [[00a6279](https://github.com/segersniels/supdock/commit/00a62792b7deb2b5958fb0dba5d5cc1cd6095db9)]
-  add restart command [[258fb6b](https://github.com/segersniels/supdock/commit/258fb6b3da3e71a9c0c34fda7f8f2f733862ac3d)]
-  add golang section to installation [[f17c4db](https://github.com/segersniels/supdock/commit/f17c4dbbafd8a832d5db68366ff430ed0ed9e690)]
-  execute not defined fixed [[64169db](https://github.com/segersniels/supdock/commit/64169dbefe06bc7f6738fd7e7a3dcb46945ed769)]
-  prune adde to readme [[585e762](https://github.com/segersniels/supdock/commit/585e762fe80d9c312c378c44b9cb42b69068cf20)]
-  prune added [[296e7c5](https://github.com/segersniels/supdock/commit/296e7c5e982191100ad75e2edd834fb3d5782538)]
-  version 0.2.2 [[308ced7](https://github.com/segersniels/supdock/commit/308ced7e7f5ddb53931b27f27af696bb93ab52b0)]
-  now shows correct message when asking for selection on docker compose [[2cab502](https://github.com/segersniels/supdock/commit/2cab502d8323d28552cddcd0829bcfcedd1397aa)]
-  readme update [[0b37987](https://github.com/segersniels/supdock/commit/0b379876eebacf898d69910af43ab294a1a04b28)]
-  readme update [[49c96f4](https://github.com/segersniels/supdock/commit/49c96f422b0b18ccc12bf0a0fa7e27bcec13ee52)]
-  package.json updated [[026e625](https://github.com/segersniels/supdock/commit/026e62555ada3691bea6b739e96b92092951c9e0)]
-  0.2.11 [[83ef8c2](https://github.com/segersniels/supdock/commit/83ef8c2142c1cedce46c1f837bac8f1a63b3d026)]
-  readme [[0ab32ad](https://github.com/segersniels/supdock/commit/0ab32ad73c9a71377a2e187da3e36165fb5c1a26)]
-  resolve merge [[b201089](https://github.com/segersniels/supdock/commit/b20108962da60fc70aff9fb53ce5d44e8ac521f4)]
-  fixed compose prompt when no action specified [[5081727](https://github.com/segersniels/supdock/commit/508172767b2a637aa720070a3f0d488b604e4c3d)]
-  added docker-compose functionality ; version 0.2.0 ; changelog added [[680df25](https://github.com/segersniels/supdock/commit/680df25f45bd5a7b47f0173dde887c79895b2c32)]
-  added env command to see environment variables of running container [[faedbab](https://github.com/segersniels/supdock/commit/faedbab2746e480b3dffb7af842ac4f6db68dfc8)]
-  refactored large part of the exec code ; version 0.1.8 [[0daf47a](https://github.com/segersniels/supdock/commit/0daf47a9e9f819dd47a621f24ad3c607406f1d0f)]
-  removed -f flag from rmi [[1c85fbe](https://github.com/segersniels/supdock/commit/1c85fbe66511b7a1d30c1d16f93d22da23c48dca)]
-  version 0.1.6 [[1940bde](https://github.com/segersniels/supdock/commit/1940bdefff4b0d9a15903415b37329ca2e4fce28)]
-  readme [[279a082](https://github.com/segersniels/supdock/commit/279a0827355bf1d30d812f6ad8d1721c9902844d)]
-  readme [[6946551](https://github.com/segersniels/supdock/commit/69465513480212b072c313ee6685768be40735f7)]
-  readme [[9927029](https://github.com/segersniels/supdock/commit/9927029f4d506fb4e6df3c54e7e09c43e45162fc)]
-  gif order [[1c852de](https://github.com/segersniels/supdock/commit/1c852de47c6a10a6714992d6ed543f8c46b1bba1)]
-  update gifs readme [[77aa464](https://github.com/segersniels/supdock/commit/77aa4648b7b6810500b7a906d8c4343faf117710)]
-  fixed stats throwing --no-stream error [[da5121b](https://github.com/segersniels/supdock/commit/da5121ba6db397af370e9866c7a614b228b43d61)]
-  updated basic readme [[67ff917](https://github.com/segersniels/supdock/commit/67ff91780b4df11290bb2c377c6d67b994d7075a)]
-  version 0.1.3 [[b463543](https://github.com/segersniels/supdock/commit/b463543cb6be8ddffcbd4522aa7cc28bb775b5cc)]
-  update readme [[bba5558](https://github.com/segersniels/supdock/commit/bba55589f02d616459d0f21d32eca2b93fa65483)]
-  imgur usage [[6280dca](https://github.com/segersniels/supdock/commit/6280dca9565578cdb081a4299a1c40fd2c96e593)]
-  center gif [[0cdddfe](https://github.com/segersniels/supdock/commit/0cdddfe0384ad87f24946d0e107189e65a901cce)]
-  center gif [[a109514](https://github.com/segersniels/supdock/commit/a109514befcbb11ead5520310b45c353439848ae)]
-  new usage gif [[9d78686](https://github.com/segersniels/supdock/commit/9d786864f5589e7f5ed318be8e8630bbfd7b63e0)]
-  resolved some of the unknown options [[20333bb](https://github.com/segersniels/supdock/commit/20333bb3eddc0a671ae8a911c42c975747e1cf57)]
-  readme issue [[d82ad78](https://github.com/segersniels/supdock/commit/d82ad78d4f399b957688a0cf2954c632546adc4c)]
-  prepare for publish [[f73b9cf](https://github.com/segersniels/supdock/commit/f73b9cf3c989938494dec2c0b2766af5f600b8ac)]
-  now read possible commands directly from program [[0f70761](https://github.com/segersniels/supdock/commit/0f70761c032feafeb59071dffb9d97ee43c794bd)]
-  npm version 0.1.0 [[9aeff76](https://github.com/segersniels/supdock/commit/9aeff76c21cd62e56ef4ae975256957c403c9722)]
-  docker now executes in current shell using child_process.spawn [[575b64e](https://github.com/segersniels/supdock/commit/575b64e760fd7a22c3ab3bd7f2ee943e7d491745)]
-  split into separate branch [[042cf21](https://github.com/segersniels/supdock/commit/042cf2165ba3cdb60aaf988959a2020aa2934712)]
-  all [[a5151bb](https://github.com/segersniels/supdock/commit/a5151bb68aeb03bd690b5cffa415758b28f290c1)]
-  update [[1888c39](https://github.com/segersniels/supdock/commit/1888c39ca6846c31e2b31656826e8039b737ead8)]
-  readme [[cabb748](https://github.com/segersniels/supdock/commit/cabb748c16b3f35d6816d26595602d8ad32010bf)]
-  rm node modules [[852b414](https://github.com/segersniels/supdock/commit/852b414d56cdb2d645252b8b82329191aa8220e0)]
-  gitignore [[be34e8c](https://github.com/segersniels/supdock/commit/be34e8c68cc2c712e3a9c0b1c359b9e6a13ce45b)]
-  preparing conversion to npm [[f66d714](https://github.com/segersniels/supdock/commit/f66d7148a5f02a828e08bec821e5a7960a1828fa)]
-  fixed start error when no containers to exited [[122c2fd](https://github.com/segersniels/supdock/commit/122c2fd5a692296b20bbeecfc1634908928ddefc)]
-  supdock version now shows docker version too [[95bbb48](https://github.com/segersniels/supdock/commit/95bbb48583fddeaf6771622bad100f60c6efe9fb)]
-  added stats functionality [[dde47ba](https://github.com/segersniels/supdock/commit/dde47ba18ae56c01df6cdaa07c6028f49bfe7caf)]
-  added possible issues to readme [[745a973](https://github.com/segersniels/supdock/commit/745a973a9e624ce4be789e7a5a5120b21cb21781)]
-  added possible issues to readme [[83dddf0](https://github.com/segersniels/supdock/commit/83dddf047303aab438dcb322588230081841a773)]
-  added possible issues to readme [[a2e29bb](https://github.com/segersniels/supdock/commit/a2e29bba9d459a17721086e19ece2932dcf464ea)]
-  added possible issues to readme [[3976505](https://github.com/segersniels/supdock/commit/39765059cf9e99a315df5db976356e77a40e01b6)]
-  ssh now shows running containers instead of all containers [[df03113](https://github.com/segersniels/supdock/commit/df03113bab705d27b1cb4a21a32e624fb86fd191)]
-  now passes the entirity of ARGV to docker in certain cases [[cd344a6](https://github.com/segersniels/supdock/commit/cd344a6d418ed9650a421a071781c2eba702f537)]
-  version 0.0.3 [[28b2565](https://github.com/segersniels/supdock/commit/28b25656c0c0afa852402fed19563a05d2d7af9c)]
-  added start functionality [[87d8661](https://github.com/segersniels/supdock/commit/87d8661b68d028fb75646141f648037b48e6351f)]
-  added possibility to still use the standard rm and rmi method of deleting [[f8c8e36](https://github.com/segersniels/supdock/commit/f8c8e3696046b0b03e580bc018eb028ba69f1e7c)]
-  added a ton more cli arguments to pass through to docker [[3ae70c5](https://github.com/segersniels/supdock/commit/3ae70c569afc3bc4f26b5b64825026c40b497281)]
-  readme updated [[e731ded](https://github.com/segersniels/supdock/commit/e731dedbccb9e0298a8a2719c7e072ace84b43b9)]
-  added alias [[f581fa7](https://github.com/segersniels/supdock/commit/f581fa7317261901aa6a14e9a6b761c5539782e3)]
-  really silent update [[14b5e3f](https://github.com/segersniels/supdock/commit/14b5e3f2bf8bfb5972d8c7fea46408a2ed87c4b6)]
-  really silent update [[d26b7a2](https://github.com/segersniels/supdock/commit/d26b7a29d3348f1550a2fd8c7dffb608443c0746)]
-  really silent update [[b95581c](https://github.com/segersniels/supdock/commit/b95581cc4a0931c516381f9c4c1140fa96e8d50d)]
-  really silent update [[9c06c47](https://github.com/segersniels/supdock/commit/9c06c47096ab052d6dff8222a66b331a07460765)]
-  really silent update [[6f8594f](https://github.com/segersniels/supdock/commit/6f8594f797338b7c0df3aaf82689d93351f3aec9)]
-  really silent update [[3d2b9ce](https://github.com/segersniels/supdock/commit/3d2b9ce197215d545f0e5c05a555ad3ef8825c5b)]
-  silent [[4306302](https://github.com/segersniels/supdock/commit/430630223182844548118d3db71d707cedd97d1c)]
-  Silent update [[d67daf8](https://github.com/segersniels/supdock/commit/d67daf808f1e978b9298f4f191cbc2240ea0e86a)]
-  echo update success [[992aeb6](https://github.com/segersniels/supdock/commit/992aeb6768e6018cc0ef7f51bd42bba189b65818)]
-  added update option [[a3f3a8d](https://github.com/segersniels/supdock/commit/a3f3a8d2862c123eb809e1e1def8d2af98becc5d)]
-  bad error message when sshing when no containers [[5105ddd](https://github.com/segersniels/supdock/commit/5105dddd69b99d86936843671f40169bd4ba54ad)]
-  usage info updated [[c8081bf](https://github.com/segersniels/supdock/commit/c8081bf3076be02a6a3ea56948276080ebced291)]
-  added ssh subcommand to make it easier to work inside the container [[2470810](https://github.com/segersniels/supdock/commit/2470810b96757f836fe287d85e794569ee087f1e)]
-  bit of linting [[5f02643](https://github.com/segersniels/supdock/commit/5f026433b657052e76243739a80a544e3d9e3c02)]
-  readme [[acfd057](https://github.com/segersniels/supdock/commit/acfd057c6673d1a93988e964aeae9220ebef9ac2)]
-  sudo readme [[2d9f52f](https://github.com/segersniels/supdock/commit/2d9f52f1b040f87df0b8c33f05dab94fc6ca6b0a)]
-  added all to usage [[c76c379](https://github.com/segersniels/supdock/commit/c76c379eef9246c027f6e4751c3fb098d6435ccc)]
-  added conditional to prevent errors when trying to see logs when no containers are present [[9e55a79](https://github.com/segersniels/supdock/commit/9e55a79099299be8711a2fe788b0d7679c86af01)]
-  added conditional to prevent errors when trying to rm and stop when no containers are present [[f2587ae](https://github.com/segersniels/supdock/commit/f2587aef04a209521f4cfdea283ed3fdb6490973)]
-  added rm all and stop all [[c81dcbc](https://github.com/segersniels/supdock/commit/c81dcbc319df3f0794f4675294bcabfd74eeefb8)]
-  readme [[feab7a5](https://github.com/segersniels/supdock/commit/feab7a57f67f63d4ebdb459e60a5e1a2a329f94e)]
-  added gitignore [[0cbf4c5](https://github.com/segersniels/supdock/commit/0cbf4c590b4983e73b4138b2bfaa70c6316c772e)]
-  removal of unnecessary files [[93c95c8](https://github.com/segersniels/supdock/commit/93c95c8e38fd83cecd1cba22775b685984feb6be)]
-  mp4 to gif [[dc8de7b](https://github.com/segersniels/supdock/commit/dc8de7b1fb7d795d679f90579c2c70b59c34dc10)]
-  added gif [[40f23af](https://github.com/segersniels/supdock/commit/40f23af950e5207f133d8025f370b9f23d58d974)]
-  code optimization [[e39ab00](https://github.com/segersniels/supdock/commit/e39ab00ff26fc9f89b57d08341f4c48ba8543567)]
-  Update README.md [[2e1317d](https://github.com/segersniels/supdock/commit/2e1317d733e8bf8816e7d2e41e18e378a892f756)]
-  Update README.md [[c9dd9d4](https://github.com/segersniels/supdock/commit/c9dd9d447f12a7ee2040cb16785f54c3f088dadb)]
-  Update README.md [[75fc4b8](https://github.com/segersniels/supdock/commit/75fc4b89d81e455a497c722ef6f002978d56c971)]
-  Delete .supdock.swp [[71aef47](https://github.com/segersniels/supdock/commit/71aef471c4ad1310f267c629cfc750c2d2286269)]
-  init [[8e35682](https://github.com/segersniels/supdock/commit/8e3568224838149848dd54cd593c775c4e8a8df6)]


