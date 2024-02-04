// https://stackoverflow.com/questions/76354966/how-to-use-the-eraserbrush-from-fabric-js-in-react-and-fix-fabric-eraserbrush-i
const path = require("path");
const { spawn } = require("child_process");
const fabricJSPath = path.join(__dirname, 'node_modules', 'fabric');

const npmBuild = spawn('node', ['build.js', 'modules=ALL', 'exclude=accessors,gestures', 'requirejs'], {
  cwd: fabricJSPath
});

npmBuild.stdout.on('data', data => console.log(data.toString()));
npmBuild.stderr.on('data', data => console.error(data.toString()));
