import { ArrowRightFromLine, ShoppingBasket } from 'lucide-react'

type WelcomeProps = {
  setIsWelcome: (value: boolean) => void;
};

export default function Welcome({setIsWelcome}: WelcomeProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
        <div className='flex items-center gap-3 animate-fade-in-down'>
            <ShoppingBasket className='h-10 w-10 text-orange-600' />
            <h1 className='text-4xl md:text-5xl font-extrabold text-green-700'>Cartzy</h1>
        </div>
        <p className='mt-4 text-gray-700 text-lg md:text-xl max-w-lg animate-fade-in-up'>
            Shop smarter with Cartzy — discover quality products, enjoy seamless checkout,
            and get fast delivery right to your doorstep.
        </p>
        <button className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-10 animate-jelly' onClick={() => setIsWelcome(false)}>
            Next
            <ArrowRightFromLine />
        </button>
    </div>
  )
}

