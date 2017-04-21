export default {
    entry: './dist/modules/simple-mapper.es5.js',
    dest: './dist/bundles/simple-mapper.umd.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'SimpleMapper',
    external: [
        '@angular/core',
        '@angular/common',
        'rxjs/Observable',
        'rxjs/Observer'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx'
    },
    onwarn: () => { return }
}