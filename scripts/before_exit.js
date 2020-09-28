import { wait } from '../src/utils/wait';

(async () => {
  console.log('waiting...');
  await wait(1000);
  console.log('Waited 1 second!');
})();
