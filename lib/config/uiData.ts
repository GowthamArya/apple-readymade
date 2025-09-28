import { TbFilterSearch } from "react-icons/tb";
import { BiSort } from "react-icons/bi";
import { GrFormPrevious,GrFormNext } from "react-icons/gr";

export const uiData = [
    {
        icon: GrFormPrevious,
        label:'Prev',
        showBgOnClick: false
    },
    {
        icon: TbFilterSearch,
        label:'Filters',
        showBgOnClick: true
    },
    {
        icon: BiSort,
        label:'Sort',
        showBgOnClick: true
    },
    {
        icon: GrFormNext,
        label:'Next',
        showBgOnClick: false
    }
];
