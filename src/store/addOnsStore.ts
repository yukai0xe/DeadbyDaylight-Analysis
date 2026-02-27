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
                    const addOns: AddOns = {
                        id: doc.id,
                        name: data.name.trim(),
                        icon: data.icon.trim(),
                        description: data.description.trim(),
                        power: data.power.trim(),
                        powerIcon: data.powerIcon.trim(),
                        camp: data.camp
                    };
                    tmp.push(addOns);
                });
                context.commit("SETDATA", tmp);
              });
        }
    }
};