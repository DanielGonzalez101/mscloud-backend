export default class Property {
    constructor({
        id = null,
        address,
        property_name,
        property_type,
        status,
        apartment_number = null,
        RNT = null,
        owner_id = null
    }) {
        this.id = id;                   // id de la propiedad en la BD
        this.address = address;         // dirección de la propiedad
        this.property_name = property_name;
        this.property_type = property_type; // 'unit' o 'house'
        this.status = status;               // 'reserved', 'occupied' o 'available'
        this.apartment_number = apartment_number;
        this.RNT = RNT;
        this.owner_id = owner_id;           // id del owner (foránea)
    }
}
