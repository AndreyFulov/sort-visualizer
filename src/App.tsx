'use client'
import { useEffect, useState } from 'react'
import './App.css'
import { calculateNote } from './algorithms/calculateNote';
import AboutMethod from './components/aboutMethod';

const audioCtx = new (window.AudioContext)();
function App() {
  const [nums, setNums] = useState<number[]>([]);
  const [highlight, setHighlight] = useState<number[]>([]);
  const [running, setRunning] = useState<boolean>(false);
  useEffect(()=> {
    let arr = [];
    for(let i = 1; i <=100;i++) {
      arr.push(i);
    }
    setNums(arr);
  },[])


  function generateNoise(frequency: number) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency * 50, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.01,audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime+.1);
  }

  function generateArray() {
    let arr = nums;
    shuffle(arr);
    setNums([...arr]);
  }
  function shuffle(arr : number[]) {
    let currentIndex = arr.length;

    while(currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex],arr[currentIndex]]
    }
  }
  async function checkSort(arr: number[]) {
    for(let i = 0; i < arr.length; i++) {
      await visualize([...arr],[i]);
    }
    setHighlight([]);
  }

  async function handleSort() {
    setRunning(true);
    await checkSort(nums);
    await sort();
    console.log('sort end');
    checkSort(nums);
    setRunning(false);
  }
  async function visualize(newArr: number[], active: number[]) {
    setNums(newArr);
    setHighlight(active);
    generateNoise(active[0]);
    await new Promise((res) => setTimeout(res, 10)); // скорость
  }
  async function sort() {
    switch(selectedMethod){
      case 'bubble':
        await sortBubble(nums);
        break;
      case 'quick':
        await sortQuick(nums)
        break;
      case 'insertion':
        await sortInsertion(nums);
        break;
      case 'selection':
        await sortSelection(nums);
        break;
    }
  }
  async function sortBubble(arr: number[]) {
    for(let i = 0; i < arr.length; i++) {
      for(let j = 0; j < arr.length;j++) {
        if(arr[j] > arr[j+1]) {
          [arr[j],arr[j+1]] = [arr[j+1], arr[j]];
          await visualize([...arr], [j,j+1])
        }
      }
    }
    setHighlight([]);
  }
  async function sortQuick(arr: number[], left = 0, right = arr.length - 1) {
  if (left >= right) return;

  const pivotIndex = await partition(arr, left, right);
  await sortQuick(arr, left, pivotIndex - 1);
  await sortQuick(arr, pivotIndex + 1, right);

  setHighlight([]); // убираем подсветку в конце
}

async function partition(arr: number[], left: number, right: number) {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      await visualize([...arr], [i, j]);
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  await visualize([...arr], [i + 1, right]);
  return i + 1;
}

async function sortInsertion(arr: number[]) {

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      await visualize([...arr], [j + 1, i]);
    }
    arr[j + 1] = key;
  }
  setHighlight([]);
}
async function sortSelection(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
      await visualize([...arr], [i, j]);
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  setHighlight([]);
}
const [aboutHide, setAboutHide] = useState<boolean>(true);
function abouthMethodShow() {
   setAboutHide(!aboutHide);
}
  const [selectedMethod, setSelectedMethod] = useState('bubble');
  function handleSortChange(e: any) {
    setSelectedMethod(e?.target.value)
    setAboutHide(true);
  }
  return (
    <div className='h-screen'>
      <div>
        <h1 className='flex justify-center items-center my-10 text-2xl font-bold'>Sort Visualizer</h1>
      </div>
      <div className='flex justify-center items-center w-full'>
        <div className='flex h-2/3 items-end w-full max-w-3/4 border'>
          {nums.map((val,i) => (
            <div key={i} className={`flex-1 ${highlight.includes(i) ? 'bg-red-400':'bg-linear-to-bl from-violet-500 to-fuchsia-500'}`} style={{height: `${val * 0.3}em`}}></div>
          ))}
        </div>
      </div>
      <div className='flex justify-center text-center items-center m-4'>
          <div className='grid grid-cols-2 gap-4 w-2/3'>
            <div className={`bg-linear-to-bl from-violet-500 to-fuchsia-500 text-bold rounded-xl ${running ? 'opacity-50':''} hover:bg-linear-to-bl hover:from-violet-800 hover:to-fuchsia-800`}><button onClick={handleSort} className='h-full w-full' disabled={running}>Отсортировать</button></div>
            <div>
              <select name='sortMethod' onChange={handleSortChange} className='bg-gray-700 rounded-xl p-1 w-full'>
                <option value='bubble'>Пузыриком</option>
                <option value='quick'>Быстрая сортировка</option>
                <option value='insertion'>Вставками</option>
                <option value='selection' disabled={true}>Выбором</option>
              </select>
            </div>
            <div className={`bg-linear-to-bl from-violet-500 to-fuchsia-500 text-bold rounded-xl ${running ? 'opacity-50':''} hover:bg-linear-to-bl hover:from-violet-800 hover:to-fuchsia-800`}>
            <button onClick={generateArray} disabled={running} className='h-full w-full'>Перемешать массив</button>
          </div>
          <div className={`bg-gradient-to-b from-green-400 to-green-800 text-bold rounded-xl ${running ? 'opacity-50':''} hover:bg-linear-to-bl hover:from-green-800 hover:to-green-1000`}>
            <button onClick={abouthMethodShow} disabled={running} className='h-full w-full'>Узнать о методе</button>
          </div>
          <div className={`col-span-full bg-gray-700 rounded-xl p-4 ${aboutHide ? 'hidden' : ''}`}>
            <AboutMethod selectedMethod={selectedMethod}/>
          </div>
          </div>
        </div>
    </div>
  )
}

export default App
