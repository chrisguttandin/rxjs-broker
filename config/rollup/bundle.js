import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    dest: 'build/es5/bundle.js',
    entry: 'build/es2015/module.js',
    external: [
        '@angular/core',
        'core-js/es7/reflect',
        'rxjs/add/operator/filter',
        'rxjs/add/operator/map',
        'rxjs/Observable',
        'rxjs/Observer',
        'rxjs/Subject'
    ],
    format: 'umd',
    moduleName: 'rxjsBroker',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                [
                    'es2015',
                    {
                        modules: false
                    }
                ]
            ]
        }),
        commonjs({
            exclude: 'node_modules/**'
        }),
        nodeResolve()
    ]
};
