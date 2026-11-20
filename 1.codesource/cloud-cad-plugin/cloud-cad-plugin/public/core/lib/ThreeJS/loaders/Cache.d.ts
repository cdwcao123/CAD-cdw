export namespace Cache {
    
    let enabled: boolean;

    
    let files: any;

    function add(key: string, file: any): void;
    function get(key: string): any;
    function remove(key: string): void;
    function clear(): void;
}
