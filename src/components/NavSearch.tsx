import { useRecoilState } from 'recoil';
import { noteState } from './Notelist';
import Fuse from 'fuse.js';
import { ChangeEvent, useState, useEffect } from 'react';
import axios from "axios";
import { AxiosResponse } from "axios";



export interface Noteinter {
    _id: string;
    title: string;
    tags: string[];
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const NavSearch = () => {
    const [, setSearchlist] = useRecoilState<Noteinter[]>(noteState);
    const [allNotes, setAllNotes] = useState<Noteinter[]>([]); 
    const [filteredNotes, setFilteredNotes] = useState<Noteinter[]>([]); 

    const [searchQuery, setSearchQuery] = useState('');



    useEffect(() => {
        axios.get("https://backend-note-2px9.onrender.com/api/showdata").then(
            (res: AxiosResponse) => {
                setAllNotes(res.data); 
                setFilteredNotes(res.data); 
            }
        ).catch((e) => {
            console.log("Error while fetching notes", e);
        });
    }, []);


    const fuse = new Fuse(allNotes, {
        keys: ['title', 'description',"tags"],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 1,
        includeScore: true,
    });

   
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim() === "") {
            setFilteredNotes(allNotes); 
        } else {
            const results = fuse.search(value);
            const filteredData = results.map(result => result.item);
            setFilteredNotes(filteredData); 
        }
        setSearchlist(filteredNotes); 
    };


    return (
        <span >
            <span className="flex justify-center items-center  ">
                <div className="">
                    <input
                        type="search"
                        className="px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring focus:ring-gray-400 w-full bg-gray-300 placeholder-gray-700"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </span>


        </span>
    );
};

export default NavSearch;
