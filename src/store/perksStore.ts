import { onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { skillsColRef, perksColRef, storage } from "../firebase";
import { ref as r, uploadBytes } from "firebase/storage";
import { Perk } from "@/types/perks";

interface PerksState {
    fbPerks: Perk[]
}

export default{
    namespaced: true,
    state: (): PerksState => ({
        fbPerks: []
    }),

    mutations:{
        SETDATA(state, data){
            state.fbPerks = data;
        }
    },

    actions:{
        GETDATA(context){
            onSnapshot(perksColRef, (querySnapshot) => {
                let tmpPerks: Perk[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as Perk;
                    console.log(data)
                    const perk: Perk = {
                        id: doc.id,
                        name: data.name,
                        icon: data.icon.trim(),
                        description: data.description,
                        character: data.character.trim(),
                        characterPortrait: data.characterPortrait.trim() || "",
                        camp: data.camp
                    };
                    tmpPerks.push(perk);
                });
                context.commit("SETDATA", tmpPerks);
              });
        },
        
        ADDDATA(context, perkData){
            addDoc(skillsColRef, {
                name: perkData.newPerkName,
                usefulness: perkData.newPerkUseful,
                icon: perkData.perkUrl,
                illustrate: perkData.newPerkInfor
            });
        },

        UPDATEDATA(context, {id, options, optionsValue}){
            updateDoc(doc(skillsColRef, id), { [options]: optionsValue });
            console.log("updatePerk");
        },

        UPLOADDATA(context, perk){
            const storageRef = r(storage, `killersSkills/${perk.name}`);
            uploadBytes(storageRef, perk).then((snapshot) => {
                console.log("Uploaded a blob or file!");
                console.log(snapshot);
            });
        }
    }
};