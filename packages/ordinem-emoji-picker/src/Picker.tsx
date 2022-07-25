import React, { useState } from "react";
import { IconType } from 'react-icons';
import { BsFillEmojiSmileFill, BsCupFill } from 'react-icons/bs';
import { FaLeaf, FaPizzaSlice } from 'react-icons/fa';
import { IoGameController } from 'react-icons/io5';
import { AiFillCar, AiFillHeart, AiFillFlag } from 'react-icons/ai';
import emojiData from '@emoji-mart/data/sets/13/apple.json';

type MockCategoryItem = {
  key: string;
  name: string;
  icon: IconType;
};


export type EmojiItem = {
  id: string;
  name: string;
  emoticons?: string[];
  keywords: string[];
  skins: {
    unified: string;
    native:
    string;
  }[];
  version: number;
};

export type CategoryItem = {
  id: string;
  emojis: string[];
};


export type EmojisStore = {
  categories: CategoryItem[];
  emojis: Record<string, EmojiItem>;
  aliases: Record<string, string>;
  sheet: {
    cols: number;
    rows: number;
  };
}


const categories: MockCategoryItem[] = [
  {
    key: 'people',
    name: 'рожи',
    icon: BsFillEmojiSmileFill
  },
  {
    key: 'nature',
    name: 'природа',
    icon: FaLeaf
  },
  {
    key: 'food',
    name: 'еда и напитки',
    icon: FaPizzaSlice
  },
  {
    key: 'activities',
    name: 'деятельность',
    icon: IoGameController
  },
  {
    key: 'travels',
    name: 'путешествия',
    icon: AiFillCar
  },
  {
    key: 'objects',
    name: 'объекты',
    icon: BsCupFill
  },
  {
    key: 'symbols',
    name: 'символы',
    icon: AiFillHeart
  },
  {
    key: 'flags',
    name: 'флаги',
    icon: AiFillFlag
  },
];


const emojiStore: EmojisStore = emojiData;

const categoryTitles: any = {
  people: 'Морды и люди',
  nature: 'Природа',
  foods: 'Еда',
  activity: 'Занятия',
  places: 'Места',
  symbols: 'Символы',
  flags: 'Флаги'
};

const Picker: React.FC = () => {

  const [searchText, setSearchText] = useState<string>('');

  const emojisData = emojiStore.emojis;

  return (
    <div className="bg-bglighten w-[31rem] h-96 flex flex-col rounded-lg text-textSecondary">
      {/* вкладки */}
      <div className="w-full flex justify-between items-stretch">
        {
          categories.map(({key, name, icon: Icon}) => (
            <button key={key} className="grow py-2 hover:bg-bgdarken flex justify-center items-center hover:first:rounded-tl-lg hover:last:rounded-tr-lg">
              <Icon size={'1.6rem'}/>
            </button>
          ))
        }
      </div>
      {/* поле поиска */}
      <div>
        <div className="w-full p-1">
          <input 
            placeholder="поиск..."
            className="py-1 px-2 w-full outline-none bg-glassydarken rounded-md"
            type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} 
          />
        </div>
      </div>
      {/* таблица эмодзи */}
      <div className="grow mb-2 relative mx-1">
        <div className="overflow-auto absolute top-0 bottom-0">
        {/* секция таблицы */}
        {emojiStore.categories.map((category) => (
          <div key={category.id} className=" w-full">
            <h1 className="font-medium pb-1 mt-2">{categoryTitles[category.id]}</h1>
            <div className="flex flex-wrap justify-start">

              {category.emojis.map((emoji) => {
                return (
                  <div key={emoji} className="basis-[12.5%]">
                    <button className="
                        relative h-[3rem] w-full text-[1.6rem] p-1 
                        bg-glassy hover:bg-glassydarken
                        flex justify-center
                        items-center
                        overflow-hidden
                      "
                      onClick={() => {
                        console.log(emojisData[emoji])
                      }}
                    >
                      <div className="h-full w-full relative">
                        {emojisData[emoji].skins[0].native}
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
            
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default Picker;