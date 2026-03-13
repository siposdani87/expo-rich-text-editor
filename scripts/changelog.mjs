import { ConventionalChangelog, runProgram } from 'conventional-changelog';

const generator = new ConventionalChangelog();

await runProgram(generator, {
    infile: 'CHANGELOG.md',
    preset: 'angular',
});
