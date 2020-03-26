const del = require('del');
const gulp = require('gulp');
const debug = require('gulp-debug');
const concat = require('gulp-concat');
const copy = require('gulp-copy');
const browserSync = require('browser-sync').create();

const { reload } = browserSync;
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass');
const pump = require('pump');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const vinylNamed = require('vinyl-named');
const through2 = require('through2');
const gulpUglify = require('gulp-uglify');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpBabel = require('gulp-babel');

const SRC = './src';
const BUILD = './build';
const PUBLIC = './public';
const paths = {
  build: {
    root: `${BUILD}/`,
    css: `${BUILD}/css/`,
    img: `${BUILD}/img/`,
    js: `${BUILD}/js/`,
    html: `${BUILD}/`,
  },
  src: {
    scss: `${SRC}/scss/main.scss`,
    js: `${SRC}/js/index.js`,
    img: `${SRC}/img/**/*`,
    public: `${PUBLIC}/**/*`,
  },
  compileWatch: {
    scss: `${SRC}/scss/**/*.scss`,
    js: `${SRC}/js/**/*.js`,
    img: `${SRC}/img/**/*`,
    html: `${SRC}/html/*.html`,
  },
  reloadWatch: {
    css: `${BUILD}/**/*.css`,
    js: `${BUILD}/**/*.js`,
    img: `${BUILD}/img/**/*`,
    html: `${BUILD}/*.html`,
  },
};

const supportedBrowsers = [
  'last 3 versions',
  'ie >= 10',
  'edge >= 12',
  'firefox >= 28',
  'chrome >= 21',
  'safari >= 6.1',
  'opera >= 12.1',
  'ios >= 7',
  'android >= 4.4',
  'blackberry >= 10',
  'operamobile >= 12.1',
  'samsung >= 4',
];
const babelConfig = { targets: { browsers: supportedBrowsers } };

const verify = () => {
  const write = (file, enc, cb) => {
    console.log('file', file.path);
    cb(null, file);
  };

  const end = cb => {
    console.log('done');
    cb();
  };

  return through2({ objectMode: true }, write, end);
};

const styles = (paths, outputFilename, outputPath) => {
  return gulp
    .src(paths)
    .pipe(sass().on('error', sass.logError))
    .pipe(debug({ title: 'scss:' }))
    .pipe(concat(outputFilename))
    .pipe(gulp.dest(outputPath));
};

const buildScripts = (mode = 'development') => done => {
  let streamMode;
  if (mode === 'development') {
    streamMode = require('./webpack/webpack.dev.js');
  } else if (mode === 'production') {
    streamMode = require('./webpack/webpack.prod.js');
  } else {
    streamMode = undefined;
  }

  ['development', 'production'].includes(mode)
    ? pump(
        [
          gulp.src(paths.src.js),
          vinylNamed(),
          webpackStream(streamMode, webpack),
          gulpSourcemaps.init({ loadMaps: true }),
          through2.obj(function(file, enc, cb) {
            const isSourceMap = /\.map$/.test(file.path);
            if (!isSourceMap) this.push(file);
            cb();
          }),
          gulpBabel({ presets: [['@babel/env', babelConfig]] }),
          ...(mode === 'production' ? [gulpUglify()] : []),
          gulpSourcemaps.write('./'),
          gulp.dest(paths.build.js),
          browserSync.stream(),
        ],
        done,
      )
    : undefined;
};

gulp.task('clean', () => del([paths.build.root], { dot: true }));

gulp.task('copy', () => {
  return gulp
    .src(paths.src.public)
    .pipe(copy(paths.build.root, { prefix: 1 }))
    .pipe(verify());
});

gulp.task('styles', callback => {
  styles([paths.src.scss], 'styles.css', paths.build.css);
  callback();
});

gulp.task('scripts', callback => {
  buildScripts()(callback);
});

gulp.task('img', () => {
  return gulp.src(paths.src.img, { since: gulp.lastRun('img') }).pipe(gulp.dest(paths.build.img));
});

gulp.task('fileInclude', callback => {
  gulp
    .src([`${SRC}/html/index.html`])
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      }),
    )
    .pipe(gulp.dest(BUILD));

  callback();
});

gulp.task(
  'build',
  gulp.series('clean', 'fileInclude', gulp.parallel('copy', 'styles', 'img', 'scripts')),
);

gulp.task('watch', () => {
  gulp.watch(paths.compileWatch.html, gulp.series('fileInclude'));
  gulp.watch(paths.compileWatch.scss, gulp.series('styles'));
  gulp.watch(paths.compileWatch.js, gulp.series('scripts'));
  gulp.watch(paths.compileWatch.img, gulp.series('img'));
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './build/',
    },
  });

  browserSync.watch(paths.reloadWatch.css).on('change', reload);
  browserSync.watch(paths.reloadWatch.js).on('change', reload);
  browserSync.watch(paths.reloadWatch.img).on('change', reload);
  browserSync.watch(paths.reloadWatch.html).on('change', reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));
