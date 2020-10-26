module.exports = {
  'check window with vg classic': {skip: true},
  'check window with vg': {skip: true},
  'check window fully with custom scroll root with css stitching': {config: {branchName: 'v2'}},
  'check window two times with vg classic': {skip: true},
  'check window fully on page with sticky header with scroll stitching': {skip: true},
  'check frame with css stitching': {config: {branchName: 'v2'}, skip: true},
  'check frame with scroll stitching': {config: {branchName: 'v2'}},
  'check frame with vg': {config: {branchName: 'v2'}, skip: true},
  'check frame fully with css stitching': {skip: true},
  'check frame fully with vg': {skip: true},
  'check frame in frame fully with css stitching': {config: {branchName: 'v1'}},
  'check frame in frame fully with scroll stitching': {config: {branchName: 'v1'}},
  'check frame in frame fully with vg': {config: {branchName: 'v1'}},
  'check window fully and frame in frame fully with css stitching': {config: {branchName: 'v2'}},
  'check window fully and frame in frame fully with scroll stitching': {config: {branchName: 'v2'}},
  'check window fully and frame in frame fully with vg': {config: {branchName: 'v2'}},
  'check region by selector with vg classic': {config: {branchName: 'no-fully-by-default'}},
  'check region by selector fully with vg': {config: {branchName: 'no-full-selector'}},
  'check fixed region by selector fully with vg': {config: {branchName: 'no-full-selector'}},
  'check overflowed region by coordinates with css stitching': {skip: true},
  'check overflowed region by coordinates with scroll stitching': {skip: true},
  'check region by selector after manual scroll with scroll stitching': {skip: true},
  'check region by selector fully on page with sticky header with css stitching': {skip: true},
  'check region by selector fully on page with sticky header with scroll stitching': {skip: true},
  'check region by coordinates in frame with css stitching': {skip: true},
  'check region by coordinates in frame with scroll stitching': {skip: true},
  'check region by coordinates in frame fully with css stitching': {skip: true},

  // Result: https://eyes.applitools.com/app/test-results/00000251798974340734/00000251798974260280/steps/1?accountId=xIpd7EWjhU6cjJzDGrMcUw~~&mode=step-editor
  'check region by selector in frame in frame fully with scroll stitching': {skip: true},

  'check region by selector in overflowed frame with scroll stitching': {skip: true},
  'check region by selector in overflowed frame after manual scroll with scroll stitching': {
    skip: true,
  },
  'should send floating region by selector with vg': {skip: true},
  'should send ignore region by selector with vg': {skip: true},
  'should send ignore region by coordinates with css stitched': {skip: true},
  'should send ignore region by coordinates with vg': {skip: true},

  'should hide and restore scrollbars with vg': {config: {branchName: 'no-full-selector'}},

  'should send floating region by coordinates with vg': {skip: true},
  'check frame after manual switch to frame with css stitching classic': {skip: true},
  'check frame after manual switch to frame with vg classic': {
    config: {branchName: 'no-fully-by-default'},
  },
  'check regions by coordinates in overflowed frame with scroll stitching': {
    config: {branchName: 'next'},
  },
  /**
   *  Fails because of the difference between SCREEN SIZE and LAYOUT VIEWPORT SIZE.
   *  We should use screen.width/screen.height for cropping/scaling and innerWidth/innerHeight to understand element location related to the viewport
   */
  'check window fully on android chrome emulator on desktop page': {skip: true},
}
