import * as path from 'path';
import * as fs from 'fs';
import { NormalizedFederationConfig } from '../config/federation-config';
import { bundle } from '../utils/build-utils';
import { ExposesInfo } from '@softarc/native-federation-runtime';
import { hashFile } from '../utils/hash-file';
import { FederationOptions } from './federation-options';
import { logger } from '../utils/logger';

export async function bundleExposed(
  config: NormalizedFederationConfig,
  options: FederationOptions,
  externals: string[]
): Promise<Array<ExposesInfo>> {
  const result: Array<ExposesInfo> = [];

  for (const key in config.exposes) {
    const outFileName = key + '.js';
    const outFilePath = path.join(options.outputPath, outFileName);
    const entryPoint = config.exposes[key];

    logger.info(`Bundling exposed module ${entryPoint}`);

    try {
      await bundle({
        entryPoint,
        tsConfigPath: options.tsConfig,
        external: externals,
        outfile: outFilePath,
        mappedPaths: config.sharedMappings,
        kind: 'exposed',
      });

      const hash = hashFile(outFilePath);
      const hashedOutFileName = `${key}-${hash}.js`;
      const hashedOutFilePath = path.join(
        options.outputPath,
        hashedOutFileName
      );
      fs.renameSync(outFilePath, hashedOutFilePath);

      result.push({ key, outFileName: hashedOutFileName });
    } catch (e) {
      logger.error('Error bundling exposed module ' + entryPoint);
      logger.error(e);
    }
  }
  return result;
}