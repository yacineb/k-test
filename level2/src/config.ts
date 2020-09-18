import path from 'path';

/** absolute path for the json file to read data from */
export function getInputFilePath() {
  return path.resolve(__dirname, '..', 'input.json');
}

/** absolute path for results json file to ouptut */
export function getOutputFilePath() {
  return path.resolve(__dirname, '..', 'ouptut.json');
}
