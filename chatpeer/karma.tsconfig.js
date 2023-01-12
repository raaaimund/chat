const karmaTypescriptConfig = {
    bundlerOptions: {
        acornOptions: {
            ecmaVersion: 2020,
        },
        transforms: [
            require("karma-typescript-es6-transform")({
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: {
                                browsers: ["last 1 Chrome versions"],
                            },
                        },
                    ],
                ],
            }),
        ],
    },
    compilerOptions: {
        target: "esnext",
        module: "commonjs",
        lib: ["esnext", "DOM"],
        strict: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        importHelpers: true,
        skipLibCheck: true,
    },
    include: ["tests"],
}

module.exports = karmaTypescriptConfig