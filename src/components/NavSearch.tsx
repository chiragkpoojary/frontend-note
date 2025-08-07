import { useRecoilState } from 'recoil';
import {noteState} from "../utils/recolNote.ts";
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
    const [filteredNotes, setFilteredNotes] = useState<Noteinter[]>([]); 

    const [searchQuery, setSearchQuery] = useState('');



    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/searchdata?search=${searchQuery}`).then(
            (res: AxiosResponse) => {

                setFilteredNotes(res.data);
            }
        ).catch((e) => {
            console.log("Error while fetching notes", e);
        });
    }, [searchQuery]);



    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
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
