import React, { useEffect, useState } from "react";
import TextField from "../common/form/textField";
import { validator } from "../../utils/validator";
import api from "../../api";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/multiSelectField";
import { useParams, useHistory } from "react-router-dom";

const EditForm = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        sex: "male",
        qualities: []
    });
    // const [updatedData, setUpdatedData] = useState(data);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const history = useHistory();
    const { userId } = params;
    useEffect(() => {
        api.users.getById(userId).then((data) => {
            setData(data);
        });
    }, []);
    const [qualities, setQualities] = useState({});
    const [professions, setProfession] = useState();
    const [errors, setErrors] = useState({});
    useEffect(() => {
        api.professions.fetchAll().then((data) => setProfession(data));
        api.qualities
            .fetchAll()
            .then((data) => setQualities(data))
            .then(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (
            data.profession.length !== 0 &&
            typeof data.profession === "string"
        ) {
            setData((prevState) => ({
                ...prevState,
                profession: Object.values(professions).filter(
                    (i) => i._id === data.profession
                )[0]
            }));
        }
    }, [data.profession]);

    useEffect(() => {
        console.log(data);
    }, [data.profession]);

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validatorConfig = {
        name: {
            isRequired: {
                message: "Имя обязательно для заполнения"
            }
        },
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        profession: {
            isRequired: {
                message: "Обязательно выберете вашу профессию"
            }
        },
        licence: {
            isRequired: {
                message:
                    "Вы не можете использовать наш сервис без лицензионного соглашения"
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        api.users
            .update(userId, data)
            .then(() => history.push(`/users/${userId}`));
        // history.push(`/users/${userId}`);
        console.log(data);
    };
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            {data.profession && (
                                <SelectField
                                    label="Выберете вашу профессию"
                                    options={professions}
                                    onChange={handleChange}
                                    defaultOption="Choose..."
                                    value={data.profession.name}
                                />
                            )}
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                options={qualities}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                                defaultValue={data.qualities.map(
                                    (qualitie) => ({
                                        label: qualitie.name,
                                        value: qualitie._id
                                    })
                                )}
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Submit
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditForm;
