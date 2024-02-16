import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar_tool from '../component/Navbar_tool';
import './Welcome.css'; // Import CSS file

function Welcome() {
    let navigate = useNavigate();
    const [segment, setSegment] = useState([]);
    const [mfg, setMfg] = useState([]);
    const [model,setMdl]=useState([]);
    const [selectedSegment, setSelectedSegment] = useState(0);
    const [selectedMfg, setSelectedMfg] = useState(0);
    const [selectedModel, setSelectedModel] = useState(0);
    const [quantity, setQuantity] = useState();
    const [selectedModelName, setSelectedModelName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        sessionStorage.setItem('quantity', quantity);
        sessionStorage.setItem('Model_id', selectedModel);
        sessionStorage.setItem('Model_Name', selectedModelName);
        navigate(`/defaultconfig/${selectedModel}`);
    };

    useEffect(() => {
        const selectedModelObject = model.find((mdl) => mdl.model_id == selectedModel);
        const name = selectedModelObject ? selectedModelObject.model_name : '';
        setSelectedModelName(name);
        console.log("checkkk"+model+selectedModel);
    }, [selectedModel, model]);

    useEffect(() => {
        const fetchSegment = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/segments");
                const data = await response.json();
                setSegment(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching segments:", error);
            }
        };
        fetchSegment();
    }, []);

    useEffect(() => {
        const fetchMfg = async () => {
            if (selectedSegment) {
                try {
                    const response = await fetch("http://localhost:8080/api/mfgbyid/" + selectedSegment);
                    const data = await response.json();
                    setMfg(data);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching Manufactorer:", error);
                }
            }
        };

        if (selectedSegment != 0) {
            fetchMfg();
        } else {
            setMfg([]); // Clear Mfg if no seg is selected
        }
        setSelectedMfg(""); // Reset selected mfg when seg changes
    }, [selectedSegment]);

    useEffect(() => {
        const fetchModel = async () => {
            if (selectedSegment && selectedMfg) {
                try {
                    const response = await fetch(`http://localhost:8080/api/Model/${selectedSegment}/${selectedMfg}`);
                    const data = await response.json();
                    setMdl(data);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching Model:", error);
                }
            }
        };
        if (selectedMfg != 0) {
            fetchModel();
        } else {
            setMdl([]); 
        }
        setSelectedModel(""); 
    }, [selectedMfg]);
  
    return (
      <div>
        <Navbar_tool style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
        <div className="entire_page">
            <div style={{ overflow: 'hidden' }}>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="SegmentDropdown">Select a Segment:</label>
                            <select
                                id="SegmentDropdown"
                                value={selectedSegment}
                                onChange={(e) => setSelectedSegment(e.target.value)}>
                                <option value="">Select a Segment</option>
                                {segment.map((seg) => (
                                    <option key={seg.seg_id} value={seg.seg_id}>
                                        {seg.seg_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="MfgDropdown">Select a Manufacturer:</label>
                            <select
                                id="MfgDropdown"
                                value={selectedMfg}
                                name="MfgName"
                                onChange={(e) => setSelectedMfg(e.target.value)}>
                                <option value="">Select a Manufacturer</option>
                                {mfg.map((mfg) => (
                                    <option key={mfg.mfg_id} value={mfg.mfg_id}>
                                        {mfg.mfg_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="ModelDropdown">Select a Model:</label>
                            <select
                                id="ModelDropdown"
                                name="ModelName"
                                onChange={(e) => setSelectedModel(e.target.value)}>
                                <option value="">Select a Model</option>
                                {model.map((model) => (
                                    <option key={model.model_id} value={model.model_id}>
                                        {model.model_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="Quantity">Quantity:</label>
                            <textarea
                                type="number"
                                step="any"
                                placeholder="Quantity"
                                inputProps={{ min: { quantity } }}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Welcome;
