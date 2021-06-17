import babel from 'rollup-plugin-babel'

const config = {
  input: './src/main.js',
  output: [
    {
      file: './dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: './dist/index.esm.js',
      format: 'esm',
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

export default config
