import {Noteinter} from "../components/NavSearch.tsx";
import {atom} from "recoil";

const noteState = atom<Noteinter[]>({
    key: 'noteState',
    default: [],
});

export {noteState};