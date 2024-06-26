//export const model = getModel();
import {MnistData} from './data.js';

const titulo = document.getElementById('title');
const estado = document.getElementById('status');

export const predecir = document.getElementById('predict');
async function showExamples(data) {

  const examples = data.nextTestBatch(20);
  const numExamples = examples.xs.shape[0];
  
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      return examples.xs
        .slice([i, 0], [1, examples.xs.shape[1]])
        .reshape([28, 28, 1]);
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = 'margin: 4px;';
    await tf.browser.toPixels(imageTensor, canvas);
    surface.drawArea.appendChild(canvas);

    imageTensor.dispose();
  }
}

async function run() {  
  const data = new MnistData();
  await data.load();
  await showExamples(data);
}

document.addEventListener('DOMContentLoaded', run);