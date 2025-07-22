import { useRecoilState } from 'recoil';
import { noteState } from './Notelist';
import Fuse from 'fuse.js';
import { ChangeEvent, useState, useEffect } from 'react';
import axios from "axios";
import { AxiosResponse } from "axios";
import { Button } from '@material-tailwind/react';
import { authState } from './authstate';
import { passwordState } from './password';

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
    const [, setIsAuthenticated] = useRecoilState(authState);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [password, setPassword] = useRecoilState(passwordState);


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

    const showFormHandler = () => setShowForm(!showForm);

 
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backend-note-2px9.onrender.com/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'passcode': password
                }
            });
            const result = await response.json();
            if (response.ok) {
                alert('Authenticated successfully!');
                setShowForm(false);
                setIsAuthenticated(true);
            } else {
                alert(result.message);
                setShowForm(false);
                setPassword("");
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
            {/* <div className='flex flex-col items-end mr-10'>
                <Button onClick={showFormHandler}>
                    {showForm ? 'Hide Auth' : 'Show Auth'}
                </Button>

                {showForm && (
                    <form onSubmit={handleSubmit} className='mt-3 space-x-2'>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className='h-10 border-gray-700 rounded-xl '
                            required
                        />
                        <Button type="submit" className='-mt-1'>Submit</Button>
                    </form>
                )}
            </div> */}
        </span>
    );
};

export default NavSearch;
