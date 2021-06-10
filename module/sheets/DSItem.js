export default class DSItem extends Item {
    
    prepareData() {
        super.prepareData();
    
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};
        const data = itemData.data;
        
        if (this.type == "Panzerung") {
            data.armor = data.mk;
            data.protection = Math.floor(data.mk / 2);
        }

            
    }
      

}