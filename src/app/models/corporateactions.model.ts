
export class CorporateActionModel {
    public APIRCodes : string[] = [];

    constructor(
        public DueDate : string,        
        public IssuerCode: string,
        public IssuerName: string,
        public EventType: string,
        public Subject: string        
    ){        
    }
} 