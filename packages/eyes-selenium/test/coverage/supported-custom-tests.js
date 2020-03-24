const supportedCustomTests = [
  {name: 'TestGetAllResults_ThrowException', executionMode: {isVisualGrid: false}},
  {name: 'TestGetAllResults_ThrowException', executionMode: {isVisualGrid: true}},
  {name: 'TestGetAllResults_IgnoreException', executionMode: {isVisualGrid: false}},
  {name: 'TestGetAllResults_IgnoreException', executionMode: {isVisualGrid: true}},
  {name: 'TestGetAllResults_AwaitCloseTransaction', executionMode: {isVisualGrid: false}},
  {name: 'TestGetAllResults_AwaitCloseTransaction', executionMode: {isVisualGrid: true}},
]

module.exports = supportedCustomTests
