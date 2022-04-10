import React from 'react';
import IconedButton from './components/shared/IconedButton';
import { 
  IoChatboxEllipsesOutline, IoPeopleOutline, IoSettingsOutline, IoPersonOutline 
} from 'react-icons/io5';
import Button from './components/shared/Button';

const App: React.FC = () => {
  return (
    <div className='
      h-screen w-screen bg-indigo-500 flex flex-col bg-fillmain text-textPrimary
      md:flex-row
    '>
      <div className='grow-0 px-4 pt-2'>
        <h1 className='text-2xl font-medium'>Атата</h1>
      </div>
      <div className='grow p-4'>
        <Button type='info'>Атата dfgdfg</Button>
        <Button type='accent'>Атата</Button>
        <Button type='warning'>Атата</Button>
        <Button type='brighten'>Атата</Button>
        <Button>Атата</Button>
      </div>
      <div className='
        rounded-t-lg basis-20 w-full bg-slate-300 flex flex-row justify-between px-4 text-sm bg-glassy
        md:flex-col md:order-first md:rounded-none md:px-0 md:justify-start
      '>
        <IconedButton icon={IoChatboxEllipsesOutline} title='Чат' />
        <IconedButton icon={IoPeopleOutline} title='Группы' />
        <IconedButton icon={IoPersonOutline} title='Контакты' />
        <IconedButton icon={IoSettingsOutline} title='Настройки' />
      </div>
    </div>
  );
}

export default App;
