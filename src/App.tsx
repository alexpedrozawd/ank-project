
import BookContainer from './components/BookContainer';

const BASE_URL = import.meta.env.BASE_URL;

function App() {
  return (
    <div 
      className="w-screen h-[100dvh] overflow-hidden flex items-center justify-center relative bg-[#1f140d] bg-cover bg-center"
      style={{ backgroundImage: `url('${BASE_URL}textures/wood.jpg')` }}
    >
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] bg-black/40 mix-blend-multiply"></div>
      <BookContainer />
    </div>
  );
}

export default App;
