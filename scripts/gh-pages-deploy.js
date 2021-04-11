/* eslint-disable no-console */
const execa = require('execa');
const fs = require('fs');
(async () => {
    try {
        console.log('Stashing changes');
        await execa('git', ['stash']);
        console.log('Changing to branch gh-pages...');
        await execa('git', ['checkout', '--orphan', 'gh-pages']);
        // eslint-disable-next-line no-console
        console.log('Building started...');
        await execa('npm', ['run', 'build']);
        console.log('Linting project...');
        await execa('npm', ['run', 'lint']);
        // Understand if it's dist or build folder
        console.log('Commiting build files...');
        const folderName = fs.existsSync('dist') ? 'dist' : 'build';
        await execa('git', ['--work-tree', folderName, 'add', '--all']);
        await execa('git', [
            '--work-tree',
            folderName,
            'commit',
            '-m',
            'gh-pages',
        ]);
        console.log('Pushing to gh-pages...');
        await execa('git', ['push', 'origin', 'HEAD:gh-pages', '--force']);
        // await execa("rm", ["-r", folderName]);
        console.log('Turn back to main branch...');
        await execa('git', ['checkout', '-f', 'main']);
        console.log('Deleting gh-pages local branch...');
        await execa('git', ['branch', '-D', 'gh-pages']);
        console.log('Successfully deployed, check your settings');
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.message);
        process.exit(1);
    }
})();
