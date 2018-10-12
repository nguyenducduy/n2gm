import * as prettyjson from "prettyjson";

export const dump = _string => {
    console.log("///////////   DUMP START   //////////");
    console.log(
        prettyjson.render(_string, {
            keysColor: "green",
            stringColor: "white",
            numberColor: "yellow",
            dashColor: "red"
        })
    );
    console.log("///////////   DUMP END   //////////");
};
