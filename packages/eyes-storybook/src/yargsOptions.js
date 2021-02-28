module.exports = {
  conf: {
    alias: 'f',
    description: 'Path to applitools.config.js config file',
    requiresArg: true,
    string: true,
  },

  storybookUrl: {
    alias: ['storybook-url', 'u'],
    description: 'URL to storybook',
    requiresArg: true,
    string: true,
  },

  // storybook options
  storybookPort: {
    alias: ['storybook-port', 'p'],
    description: 'Port to run Storybook',
    requiresArg: false,
    number: true,
  },
  storybookHost: {
    alias: ['storybook-host', 'h'],
    description: 'Host to run Storybook',
    requiresArg: false,
    string: true,
  },
  storybookConfigDir: {
    alias: ['storybook-config-dir', 'c'],
    description: "Path to Storybook's config folder (defaults to .storybook)",
    requiresArg: true,
    string: true,
  },
  storybookStaticDir: {
    alias: ['storybook-static-dir', 's'],
    description: "Path to Storybook's static files folder",
    requiresArg: true,
    string: true,
  },
  showStorybookOutput: {
    alias: ['show-storybook-output'],
    description: 'whether or not you want to see Storybook output',
    boolean: true,
  },
  readStoriesTimeout: {
    alias: ['read-stories-timeout'],
    description: 'The time to wait until all stories are read, before starting the visual tests',
    number: true,
  },

  include: {
    description:
      'A string that represents a story title or a regex (starts and ends with /) to match stories title',
    requiresArg: false,
    string: true,
    coerce: function(arg) {
      if (arg.startsWith('/') && arg.endsWith('/')) {
        // create a regex and remove slashes from the start and end of the input
        return new RegExp(arg.substring(1, arg.length - 1));
      } else return arg;
    },
  },

  // general
  exitcode: {
    alias: 'e',
    description: 'If tests failed close with non-zero exit code',
    requiresArg: false,
    boolean: true,
  },
};
