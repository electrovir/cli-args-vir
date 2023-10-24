import {basename} from 'path';

/**
 * Trims arguments list to remove all arguments that take place before the script's file name or
 * executable bin name.
 *
 * @example
 *     extractRelevantArgs({
 *         rawArgs: [
 *             'npx',
 *             'ts-node',
 *             './my-script.ts',
 *             'arg1',
 *             '--arg2',
 *         ], // typically will be process.argv
 *         binName: 'my-script', // should be your package.json "bin" property name, can be undefined
 *         fileName: 'my-script.ts', // should be __filename from the script that will be executed
 *     });
 *     // will output ['arg1', '--arg2']
 */
export function extractRelevantArgs({
    rawArgs,
    binName,
    fileName,
    errorIfNotFound,
}: Readonly<{
    /** Raw arguments passed to the CLI. Typically this will simply be process.argv. */
    rawArgs: ReadonlyArray<string>;
    /**
     * Executable bin name for your script. This should be the "bin" name in your package.json, or
     * simply your package name if you have no custom bin name defined.
     *
     * See https://docs.npmjs.com/cli/v10/configuring-npm/package-json#bin for details on the bin
     * field of package.json
     */
    binName: string | undefined;
    /**
     * The name or path of your script file that will be executed via the CLI. This should almost
     * always simply be __filename or its ESM equivalent
     * (https://stackoverflow.com/questions/46745014).
     */
    fileName: string;
    /**
     * If set to true, this function with throw an error if the given file or bin name was not found
     * in the given arguments list.
     */
    errorIfNotFound?: boolean | undefined;
}>): string[] {
    const baseFileName = basename(fileName);

    if (!baseFileName) {
        throw new Error(
            `Given file name produced no base file name (with path.basename()): '${fileName}'`,
        );
    }

    const lastIrrelevantArgIndex = rawArgs.findIndex((arg) => {
        const baseArgName = basename(arg);
        const matchesFileName = baseArgName === baseFileName;
        const matchesBinName = binName ? baseArgName === binName : false;
        return matchesFileName || matchesBinName;
    });
    if (lastIrrelevantArgIndex === -1) {
        if (errorIfNotFound) {
            throw new Error('Failed to find position of file or bin name in provided args list.');
        } else {
            return [...rawArgs];
        }
    } else {
        return rawArgs.slice(lastIrrelevantArgIndex + 1);
    }
}
