import axios from "axios";
import type { FormEvent } from "react";

const Form = () => {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            query: { value: string };
            maxResults: { value: string };
        };

        const query = target.query.value;
        const maxResults = target.maxResults.value;

        const BASE_URL = 'http://localhost:3300/'

        const result =  await axios(`${BASE_URL}?query=${query}&maxResults=${maxResults}`);

        console.log(result);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="query" />
            <select name="maxResults">
                <option value="10" defaultChecked>TOP 10</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
            </select>
            <input type="submit" />
        </form>
    )
};

export default Form;