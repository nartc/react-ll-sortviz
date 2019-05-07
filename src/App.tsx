import React from 'react';
import './App.css';
import { ALGORITHM_NAME_MAP } from './utils/Sort';
import { Col } from './utils/Col';

// CONSTANTS
export const MAX_COLS = 500;
const TIME = 1000 / 100;

type AppProps = {};

type AppState = {
  currentAlgorithmIndex: number;
  count: number;
  isRunning: boolean;
};

class App extends React.Component<AppProps, AppState> {
  private readonly _canvasRef: React.RefObject<HTMLCanvasElement>;
  private _canvasCtx: CanvasRenderingContext2D;
  private _frame: number = 0;
  private _arr: Col[] = [];
  private _oldVal: string = '';

  constructor(props: AppProps) {
    super(props);
    this._canvasRef = React.createRef();
    this.state = {
      count: 0,
      currentAlgorithmIndex: 0,
      isRunning: false
    };
  }

  bubbleSort = async (array: Col[]) => {
    for (let i = 0, length = array.length - 1; i < length; i++) {
      if (array[i].height < array[i + 1].height) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        this.setState(prev => ({ count: prev.count + 1 }));
        await this.sleep(TIME);
      }
    }
    this._oldVal = JSON.stringify(array);
  };

  reverseSort = async (array: Col[]) => {
    let maxIndex: number;
    const length = array.length;

    for (let i = 0; i < length; i++) {
      maxIndex = i;
      for (let j = i + 1; j < length; j++) {
        if (array[j].height > array[maxIndex].height) {
          maxIndex = j;
          this.swapIndex(array, i, maxIndex);
          this.setState(prev => ({ count: prev.count + 1 }));
          await this.sleep(TIME);
        }
      }
    }

    this._oldVal = JSON.stringify(array);
  };

  cocktailSort = async (array: Col[]) => {
    let i;
    let left = 0;
    let right = array.length - 1;

    while (left < right) {
      for (i = left; i < right; i++) {
        if (array[i].height < array[i + 1].height) {
          this.swapIndex(array, i, i + 1);
          this.setState(prev => ({ count: prev.count + 1 }));
          await this.sleep(TIME);
        }
      }

      right--;
      for (i = right; i > left; i--) {
        if (array[i - 1].height < array[i].height) {
          this.swapIndex(array, i - 1, i);
          this.setState(prev => ({ count: prev.count + 1 }));
          await this.sleep(TIME);
        }
      }
      left++;
    }

    this._oldVal = JSON.stringify(array);
  };

  insertionSort = async (array: Col[]) => {
    let i: number;
    let el: Col;
    let j: number;
    const length = array.length;

    for (i = 1; i < length; i++) {
      el = array[i];
      j = i;

      while (j > 0 && array[j - 1].height < el.height) {
        array[j] = array[j - 1];
        this.setState(prev => ({ count: prev.count + 1 }));
        await this.sleep(TIME);
        j--;
      }

      array[j] = el;
    }

    this._oldVal = JSON.stringify(array);
  };

  selectionSort = async (array: Col[]) => {
    let minIndex: number;
    for (let i = 0, length = array.length; i < length; i++) {
      minIndex = i;
      for (let j = i + 1; j < length; j++) {
        if (array[j].height > array[minIndex].height) {
          minIndex = j;
          this.setState(prev => ({ count: prev.count + 1 }));
          this.swapIndex(array, i, minIndex);
          await this.sleep(TIME);
        }
      }
    }

    this._oldVal = JSON.stringify(array);
  };

  private algorithmMap = {
    0: this.bubbleSort,
    1: this.reverseSort,
    2: this.cocktailSort,
    3: this.insertionSort,
    4: this.selectionSort
  };

  sleep = (time: number) => {
    return new Promise(resolve => setTimeout(resolve, time));
  };

  swapIndex = (array: Col[], oldIndex: number, newIndex: number) => {
    const temp = array[oldIndex];
    array[oldIndex] = array[newIndex];
    array[newIndex] = temp;
  };

  componentDidMount() {
    this._canvasCtx = (this._canvasRef.current as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
    this.setState({ isRunning: true });
    this.init();
    this.animate();
  }

  sortChangedCallback = () => {
    console.log('callback');
    this.init();
    this.animate();
  };

  prevClick = () => {
    this.setState(prev => (
      {
        currentAlgorithmIndex: (prev.currentAlgorithmIndex - 1 + Object.keys(this.algorithmMap).length) % Object.keys(this.algorithmMap).length,
        count: 0,
        isRunning: true
      }
    ), this.sortChangedCallback);
  };

  nextClick = () => {
    this.setState(prev => (
      {
        currentAlgorithmIndex: (prev.currentAlgorithmIndex + 1) % Object.keys(this.algorithmMap).length,
        count: 0,
        isRunning: true
      }
    ), this.sortChangedCallback);
  };

  randomize = () => {
    return ~~(this._canvasRef.current.height / 100 * ~~(Math.random() * 99) + 1);
  };

  animate = () => {
    const { currentAlgorithmIndex } = this.state;
    const raf = window.requestAnimationFrame(this.animate);
    if (this._frame <= 0) {
      this._frame++;
      return;
    }

    this._frame = 0;
    this._canvasCtx.clearRect(0, 0, this._canvasRef.current.width, this._canvasRef.current.height);

    this.algorithmMap[currentAlgorithmIndex](this._arr);

    this._arr.forEach((col, index) => {
      col.update(index);
    });

    if (this._oldVal === JSON.stringify(this._arr)) {
      window.cancelAnimationFrame(raf);
      this._arr = [];
      this.setState({ isRunning: false });
    }
  };

  init = () => {
    for (let i = 0; i < MAX_COLS; i++) {
      this._arr.push(new Col(this.randomize(), this._canvasCtx, this._canvasRef.current.width));
    }
  };

  render() {
    const { currentAlgorithmIndex, count, isRunning } = this.state;
    return (
      <div className="App">
        <h1 className="H1">{ ALGORITHM_NAME_MAP[currentAlgorithmIndex] }
          <small className='Small'>({ count })</small>
        </h1>
        <div className="Controls">
          <button disabled={ isRunning } onClick={ this.prevClick }>Prev</button>
          <button disabled={ isRunning } onClick={ this.nextClick }>Next</button>
        </div>
        <canvas ref={ this._canvasRef } className="Canvas" width={ window.innerWidth } height={ window.innerHeight }/>
      </div>
    );
  }
}

export default App;
