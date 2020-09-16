const workboxBuild = require("workbox-build");

const buildSW = () => {
  // The build is expected to fail if the
  // sw install rules couldn't be generated.
  // Add a catch block to handle this scenario.
  return workboxBuild
    .injectManifest({
      swSrc: "src/sw-custom.js", 

      swDest: "build/sw.js", 

      globDirectory: "build",

      globPatterns: ["**/*.{js,css,html,png,svg}"],
    })
    .then(({ count, size, warnings }) => {
      warnings.forEach(console.warn);
      console.info(`${count} files will be precached,
                  totaling ${size} bytes.`);
    });
};

buildSW();