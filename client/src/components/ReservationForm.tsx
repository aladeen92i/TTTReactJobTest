import { DatePicker } from "@material-ui/pickers";
import * as React from "react";
import { getAutoCompleteData } from "../utils/getAutoCompleteData";
import {Autocomplete} from '@material-ui/lab'
import {TextField, CircularProgress} from '@material-ui/core'

type formValues = {
  from: string;
  to: string;
  fromDateTime: string;
  returnDateTime: string;
};

interface AutocompleteType {
  city_id: number;
  station_id: number;
  local_name: string;
  latitude: number;
  longitude: number;
  unique_name: string;
  station_unique_name?: null;
  iscity: boolean;
  score: number;
  serviced: boolean;
  emoji?: null;
  gpuid: string;
}

export default function ReservationForm() {
  const [values, setValues] = React.useState<formValues>({
    from: "",
    to: "",
    fromDateTime: "",
    returnDateTime: "",
  });

  const [options, setOptions] = React.useState<string[]>([]);
  let temp: Array<string> = [];

  const [open, setOpen] = React.useState(false);
  const loading = open && options.length === 0;
  
  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await fetch(
        "https://api.comparatrip.eu/cities/autocomplete/?q=" + values.from,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        }
      )
        .then((response) => response.body)
        .then((rb) => {
          const reader = rb!.getReader();
          return new ReadableStream({
            start(controller) {
              // The following function handles each data chunk
              function push() {
                // "done" is a Boolean and value a "Uint8Array"
                reader.read().then(({ done, value }) => {
                  // If there is no more data to read
                  if (done) {
                    console.log("done", done);
                    controller.close();
                    return;
                  }
                  // Get the data and send it to the browser via the controller
                  controller.enqueue(value);
                  // Check chunks by logging to the console
                  console.log(done, value);
                  push();
                });
              }
  
              push();
            },
          });
        })
        .then((stream) => {
          // Respond with our stream
          return new Response(stream, {
            headers: { "Content-Type": "text/html" },
          }).json();
        })
        .then((results) => {
          
          results.forEach((result: AutocompleteType) => {
            temp.push(result.unique_name)
          })
          console.log(results)
          console.log(temp)
        });

    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  React.useEffect(() => {
    console.log(options)
}, [options]);


  const handleChange =
    (fieldName: keyof formValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues({ ...values, [fieldName]: e.currentTarget.value });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit", values);
  };

  return (
    <div>
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) => option.name}
      options={temp}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="From"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
      {/* <div>
        {" "}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="From"
            value={values.from}
            onChange={handleChange("from")}
          />
          <textarea
            placeholder="to"
            value={values.to}
            onChange={handleChange("to")}
          />

          <button type="submit">Submit</button>
        </form>
      </div> */}

    </div>
  );
}
