import { TbFilterSearch } from "react-icons/tb";
import { BiSort } from "react-icons/bi";
import { GrFormPrevious,GrFormNext } from "react-icons/gr";
import { on } from "events";

export const uiData = [
    {
        icon: GrFormPrevious,
        label:'Prev',
        showBgOnClick: false,
        key: 'prev',
    },
    {
        icon: TbFilterSearch,
        label:'Filters',
        showBgOnClick: true,
        key: 'filter',
    },
    {
        icon: BiSort,
        label:'Sort',
        showBgOnClick: true,
        onclick: () => {},
        key: 'sort',
    },
    {
        icon: GrFormNext,
        label:'Next',
        showBgOnClick: false,
        onclick: () => {},
        key: 'next',
    }
];
