// src/App.js
import React, { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
import './App.css';
import { buildSeedData } from './seedData';

import { subscribeToData, saveData } from './firebase';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
const byEntryKey = (a, b) => collator.compare(a[0], b[0]); // a,b are [key, value]

const defaultVariantState = () => ({
  check: false,
  count: 0,
  box: false,
  completed: false,
});
const makeBrandTemplate = () => ({});

const tabs = [
  { key: 'can', label: 'CAN' },
  { key: 'bottles', label: 'Bottles' },
  { key: 'bigBottles', label: 'Big Bottles' },
];

const initialData = {
  can: {}, bottles: {}, bigBottles: {}
};

function App() {

  const [data, setData] = useState(initialData);
  const [view, setView] = useState('can');
  const [editing, setEditing] = useState(false);

  const [showNewBrandForm, setShowNewBrandForm] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [addingVariantBrand, setAddingVariantBrand] = useState(null);
  const [newVariant, setNewVariant] = useState('');

  const seedDb = async () => {
    if (!window.confirm('Seed Firestore with the predefined items?')) return;
    const seed = buildSeedData();
    setData(seed);
    try {
      await saveData(seed);
      alert('Seeded!');
    } catch (e) {
      console.error(e);
      alert('Seeding failed: ' + (e.message || e.code));
    }
  };

  // Subscribe to Firestore on mount
  useEffect(() => {
    const mount = async () => {
      const unsub = await subscribeToData(remote => {
        setData(remote || initialData);
        if (!(remote || initialData)[view]) setView('can');
      });
      return unsub;
    };
    const cleanupPromise = mount();
    return () => { cleanupPromise.then(unsub => unsub && unsub()); };
  }, []); // only once

  // put this above function App()
  const resetCountsAndFlags = (state) => {
    const out = {};
    for (const cat of Object.keys(state)) {
      const brands = state[cat] || {};
      const newBrands = {};
      for (const brand of Object.keys(brands)) {
        const variants = brands[brand] || {};
        const newVariants = {};
        for (const v of Object.keys(variants)) {
          const vals = variants[v] || {};
          newVariants[v] = {
            ...vals,
            count: 0,
            box: false,
            check: false,
            completed: false,
          };
        }
        newBrands[brand] = newVariants;
      }
      out[cat] = newBrands;
    }
    return out;
  };

  const resetAll = async () => {
    const updated = resetCountsAndFlags(data);   // keep structure, check/box/completed untouched
    setData(updated);
    try {
      await saveData(updated);             // persist to Firestore
    } catch (e) {
      console.error('Reset counts failed', e);
    }
    // just tidy the UI bits; keep current view & editing state
    setShowNewBrandForm(false);
    setNewBrand('');
    setAddingVariantBrand(null);
    setNewVariant('');
  };

  const handleAddBrand = async () => {
    const key = newBrand.trim().toLowerCase();
    if (!key) return;
    if (data[view][key]) return alert(`"${key}" already exists in ${view}.`);

    const updated = { ...data, [view]: { ...data[view], [key]: {} } };
    setData(updated);
    try {
      await saveData(updated);
    } catch (e) {
      alert('Save failed: ' + (e.message || e.code));
    }

    setNewBrand('');
    setShowNewBrandForm(false);
  };

  const deleteBrand = (brandKey) => {
    const { [brandKey]: _, ...rest } = data[view];
    const updated = { ...data, [view]: rest };
    setData(updated);
    saveData(updated).catch(console.error);
  };

  const handleAddVariant = (brand) => {
    const key = newVariant.trim().toLowerCase();
    if (!key) return;
    if (data[view][brand][key]) return alert(`"${key}" already exists under ${brand}.`);

    const updated = {
      ...data,
      [view]: {
        ...data[view],
        [brand]: {
          ...data[view][brand],
          [key]: defaultVariantState()
        }
      }
    };
    setData(updated);
    saveData(updated).catch(console.error);

    setAddingVariantBrand(null);
    setNewVariant('');
  };


  const deleteVariant = (brandKey, variantKey) => {
    const { [variantKey]: _, ...restVars } = data[view][brandKey];
    const updated = {
      ...data,
      [view]: { ...data[view], [brandKey]: restVars }
    };
    setData(updated);
    saveData(updated).catch(console.error);
  };


  const toggleField = (cat, brand, variant, field) => {
    const updated = {
      ...data,
      [cat]: {
        ...data[cat],
        [brand]: {
          ...data[cat][brand],
          [variant]: {
            ...data[cat][brand][variant],
            [field]: !data[cat][brand][variant][field]
          }
        }
      }
    };
    setData(updated);
    saveData(updated).catch(console.error);
  };


  const updateCount = (cat, brand, variant, raw) => {
    const count = Math.max(0, parseInt(raw, 10) || 0);
    const updated = {
      ...data,
      [cat]: {
        ...data[cat],
        [brand]: {
          ...data[cat][brand],
          [variant]: { ...data[cat][brand][variant], count }
        }
      }
    };
    setData(updated);
    saveData(updated).catch(console.error);
  };


  const activeData = data[view];

  return (
    <div className="App">
      {/* HEADER */}
      <header className="header">

        <div className='header-sec-1'>
          <button className="btn-reset" onClick={resetAll}>
            <i className="ri-refresh-line" /> Start again
          </button>
          <button
            className={`btn-edit-toggle ${editing ? 'active' : ''}`}
            onClick={() => setEditing(e => !e)}
          >
            <i className={`ri-${editing ? 'check-line' : 'edit-line'}`} />
            {editing ? 'Done' : 'Edit'}
          </button>
        </div>

        <div className="header-controls">

          {showNewBrandForm ? (
            <div className="new-item-form">
              <input
                type="text"
                placeholder="Brand name"
                value={newBrand}
                onChange={e => setNewBrand(e.target.value)}
              />
              <button onClick={handleAddBrand}>
                <i className="ri-check-line" />
              </button>
              <button onClick={() => setShowNewBrandForm(false)}>
                <i className="ri-close-line" />
              </button>
            </div>
          ) : (
            <div
              className="btn-new-item"
              onClick={() => setShowNewBrandForm(true)}
            >
              <i className="ri-add-line" /> New Brand
            </div>
          )}
        </div>

      </header>

      {/* MAIN LIST */}
      <section className="section">
        {Object.entries(activeData).sort(byEntryKey).map(([brand, variants]) => (
          <div key={brand} className="brand-block">
            <h1 className="brand-header">
              {brand.charAt(0).toUpperCase() + brand.slice(1)}
              {editing && (
                <button
                  className="btn-delete-brand"
                  onClick={() => deleteBrand(brand)}
                >
                  <i className="ri-delete-bin-line" />
                </button>
              )}
              <button
                className="btn-add-variant"
                onClick={() => {
                  setAddingVariantBrand(brand);
                  setNewVariant('');
                }}
              >
                <i className="ri-add-line" />
              </button>
            </h1>

            {addingVariantBrand === brand && (
              <div className="new-variant-form">
                <input
                  type="text"
                  placeholder="Variant name"
                  value={newVariant}
                  onChange={e => setNewVariant(e.target.value)}
                />
                <button onClick={() => handleAddVariant(brand)}>
                  <i className="ri-check-line" />
                </button>
                <button onClick={() => setAddingVariantBrand(null)}>
                  <i className="ri-close-line" />
                </button>
              </div>
            )}

            {Object.entries(variants).sort(byEntryKey).map(([variant, vals]) => (
              <div className="item-row" key={variant}>
                <input
                  className='item-tick'
                  type="checkbox"
                  checked={vals.check}
                  onChange={() => toggleField(view, brand, variant, 'check')}
                />
                <label>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </label>
                <div className="count-stepper">
                  <button
                    className="btn-minus"
                    onClick={() =>
                      updateCount(view, brand, variant, vals.count - 1)
                    }
                  >
                    <i className="ri-subtract-line" />
                  </button>
                  <input
                    type="number"
                    className='item-count'
                    value={vals.count}
                    onChange={e =>
                      updateCount(view, brand, variant, e.target.value)
                    }
                  />
                  <button
                    className="btn-plus"
                    onClick={() =>
                      updateCount(view, brand, variant, vals.count + 1)
                    }
                  >
                    <i className="ri-add-line" />
                  </button>
                </div>
                {!editing && <div className='item-btn-group'>
                    <button
                    className="btn-box"
                    onClick={() => toggleField(view, brand, variant, 'box')}
                  >
                    <img
                      src={
                        vals.box
                          ? '/icons/stack-fill.svg'
                          : '/icons/stack-line.svg'
                      }
                      alt="Box Icon"
                      style={{ width: '20px', height: '20px' }}
                    />
                  </button>
                  <button
                    className="btn-complete"
                    onClick={() =>
                      toggleField(view, brand, variant, 'completed')
                    }
                  >
                    <i
                      className={
                        vals.completed
                          ? 'ri-checkbox-circle-fill color-green'
                          : 'ri-checkbox-circle-line'
                      }
                    />
                  </button>
                </div> }
                {editing && (
                  <button
                    className="btn-delete-variant"
                    onClick={() => deleteVariant(brand, variant)}
                  >
                    <i className="ri-delete-bin-line" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* STATIC BOTTOM NAV */}
      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={view === tab.key ? 'active' : ''}
            onClick={() => setView(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
