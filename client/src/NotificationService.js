

class NotificationService {

    constructor(){

        this.availiable = "Notification" in window
        if(!this.availiable) return;

        if(Notification.permission === "granted"){
            this.enabled = true;
        }
        else if (Notification.permission === "denied"){
            this.enabled = false;
        }
        else if (Notification.permission !== "denied"){
            this.enabled = false;
            Notification.requestPermission(permission =>{
                this.enabled = permission === "granted"
            })
        }
    }

    show(message){
        if(this.availiable && this.enabled){
            new Notification(message);
        }
    }

}

const notify = new NotificationService();

export default notify
