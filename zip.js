import AdmZip from 'adm-zip';
import fs from 'node:fs';

// 指定 dist 目录
const dist = './dist';

// 创建 zip 文件
const zip = new AdmZip();

// 递归读取 dist 目录下的所有文件和子目录
function addFilesToZip(zip, directory, baseDirectory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = `${directory}/${file}`;
        const relativePath = filePath.replace(baseDirectory + '/', '');

        if (fs.statSync(filePath).isDirectory()) {
            // 如果是子目录，递归添加子目录内的文件
            addFilesToZip(zip, filePath, baseDirectory);
        } else {
            // 如果是文件，将文件添加到 zip 中，第一个参数为文件在 zip 中的路径
            zip.addFile(relativePath, fs.readFileSync(filePath));
        }
    }
}

// 调用函数将 dist 目录内的文件添加到 zip 中
addFilesToZip(zip, dist, dist);

// 保存 zip 文件
const zipFileName = `${dist}/dist.zip`;
zip.writeZip(zipFileName);

console.log(`成功将 ${dist} 目录下的文件打包成 ${zipFileName} 文件`);
