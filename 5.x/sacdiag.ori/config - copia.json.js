{
  "name"    : "sacdiag",

  "include" :
  [
    {
      "path" : "${QOOXDOO_PATH}/tool/data/config/application.json"
    }
  ],

  "export" :
  [
    "api",
    "api-data",
    "build",
    "clean",
    "distclean",
    "dependencies",
    "fix",
    "info",
    "lint",
    "migration",
    "pretty",
    "profiling",
    "source",
    "source-all",
    "source-hybrid",
    "source-server",
    "source-server-reload",
    "source-httpd-config",
    "test",
    "test-source",
    "translation",
    "validate-config",
    "validate-manifest",
    "watch"
  ],

  "default-job" : "source-hybrid",

  "let" :
  {
    "APPLICATION"  : "sacdiag",
    "QOOXDOO_PATH" : "../../../qooxdoo-5.0.2-sdk",
    "QXTHEME"      : "sacdiag.theme.Theme",
    "API_EXCLUDE"  : ["qx.test.*", "${APPLICATION}.theme.*", "${APPLICATION}.test.*"],
    "LOCALES"      : [ "es" ],
    "CACHE"        : "${TMPDIR}/qx${QOOXDOO_VERSION}/cache",
    "ROOT"         : "."
  },

  // You only need to edit the remainder of this file, if you want to customize
  // specific jobs, or add own job definitions.

  "jobs" :
  {
    // Uncomment the following entry to add a contrib or library to your
    // project; make sure to adapt the path to the Manifest.json; if you are
    // using a contrib: library, it will be downloaded into the path specified
    // by the 'cache/downloads' config key

    "libraries" :
    {
      "library" :
      [
        {
          "manifest" : "../QxJqPlot/Manifest.json"
        },
        {
          "manifest" : "../Dialog/Manifest.json"
        },
        {
          "manifest" : "../componente/Manifest.json"
        }
      ]
    }


    // If you want to tweak a job setting, see the following sample where
    // the "format" feature of the "build-script" job is overridden.
    // To see a list of available jobs, invoke 'generate.py x'.

    ,"build-script" :
    {
	  "copy-files" :
	  {
		"files" :
		[
		  "services"
		]
	  }
    /*
      "compile-options" :
      {
        "code" :
        {
          "format" : false
        }
      }
	*/
    }

  }
}
