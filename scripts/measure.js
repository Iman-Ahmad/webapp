async function measure(framework) {
    const { process: runningProcess, port } = await preview(framework);
    await sleep(2000);
  
    const measureUrl = `http://localhost:${port}${path}`;
    console.info(`Getting Lighthouse report for ${chalk.green(framework)} on ${measureUrl}`);
  
    const report = await getLighthouseReport(measureUrl, RUNS);
    results[framework] = getSimpleReport(report);
  
    const outputDir = 'apps/components/src/reports';
    const pathFragment = path === '/' ? '/' : path + '/';
    const jsonPath = `${outputDir}${pathFragment}${framework}.json`;
    const jsPath = `${outputDir}${pathFragment}${framework}.ts`;
  
    if (process.env.NO_WRITE !== 'true') {
      await Promise.all([
        fs.outputFile(jsonPath, JSON.stringify(report, null, 2)),
        fs.outputFile(
          jsPath,
          `export default ${JSON.stringify(report, null, 2)} as LH.Result`
        )
      ]);
    }
  
    runningProcess.catch(() => null);
    await runningProcess.kill();
  }
  