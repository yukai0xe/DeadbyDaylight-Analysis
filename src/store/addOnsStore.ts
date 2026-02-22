import { onSnapshot } from "firebase/firestore";
import { addOnesColRef } from "../firebase";
import { AddOns } from "@/types/addOns";

interface AddOnsState {
    fbAddOns: AddOns[];
}

export default{
    namespaced: true,
    state: (): AddOnsState => ({
        fbAddOns: []
    }),

    mutations:{
        SETDATA(state, data){
            state.fbAddOns = data;
        }
    },

    actions:{
        GETDATA(context){
            onSnapshot(addOnesColRef, (querySnapshot) => {
                let tmp: AddOns[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as AddOns;
                    const perk: AddOns = {
                        id: doc.id,
                        name: data.name,
                        icon: data.icon,
                        description: data.description,
                    };
                    tmp.push(perk);
                });
                context.commit("SETDATA", tmp);
              });
        }
    }
};