export type ApiModal = {
    title: string;
    content: string;
    status: boolean;
    router:string;
    call?:()=>{

    };
}

export enum ModalTypes {
    "ERR_API" = "ERR_API",
    "SUCCESS_API" = "SUCCESS_API",
    "CONFIRM_API" = "CONFIRM_API"
}
