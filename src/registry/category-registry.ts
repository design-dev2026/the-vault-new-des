export type CategorySlug = 
  | 'statue' 
  | 'figure' 
  | 'hotwheel' 
  | 'lego' 
  | 'trading_card' 
  | 'sneakers' 
  | 'video_game' 
  | 'watch' 
  | 'designer_toy';

export type FieldType = 'text' | 'number' | 'select' | 'switch' | 'date' | 'textarea' | 'manufacturer';

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  default?: any;
  options?: string[];
  dependsOn?: string;
  placeholder?: string;
}

export interface Section {
  title: string;
  fields: Field[];
}

export interface CategoryConfig {
  label: string;
  icon: string;
  sections: Section[];
}

export const CATEGORY_REGISTRY: Record<CategorySlug, CategoryConfig> = {
  statue: {
    label: 'Statue',
    icon: 'Citadel', // Lucide icon name
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'artist_name', label: 'Artist Name', type: 'text' },
          { key: 'manufacturer', label: 'Manufacturer', type: 'manufacturer', required: true },
          { key: 'license_holder', label: 'License Holder', type: 'text' },
          { key: 'series_name', label: 'Series Name', type: 'text' },
          { key: 'edition', label: 'Edition', type: 'text', placeholder: 'e.g. Exclusive, Regular' },
          { key: 'art_style', label: 'Art Style', type: 'select', options: ['Realistic', 'Anime/Manga', 'Chibi', 'Stylized', 'Other'] },
          { key: 'pose', label: 'Pose', type: 'text' },
        ]
      },
      {
        title: 'Physical Details',
        fields: [
          { key: 'scale', label: 'Scale', type: 'select', options: ['1/1', '1/2', '1/3', '1/4', '1/6', '1/10', 'Other'] },
          { key: 'material', label: 'Material', type: 'select', options: ['Polystone', 'Resin', 'PVC', 'Cold Cast', 'Mixed Media', 'Other'] },
          { key: 'height_cm', label: 'Height (cm)', type: 'number' },
          { key: 'width_cm', label: 'Width (cm)', type: 'number' },
          { key: 'depth_cm', label: 'Depth (cm)', type: 'number' },
          { key: 'weight_g', label: 'Weight (g)', type: 'number' },
          { key: 'sculptor', label: 'Sculptor', type: 'text' },
        ]
      },
      {
        title: 'Edition & Rarity',
        fields: [
          { key: 'edition_run', label: 'Edition Run', type: 'number' },
          { key: 'edition_number', label: 'Edition Number', type: 'text' },
        ]
      },
      {
        title: 'Provenance & Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
          { key: 'original_retail_price', label: 'Original Retail Price', type: 'number' },
          { key: 'purchase_location', label: 'Purchase Location', type: 'text' },
          { key: 'is_insured', label: 'Insured', type: 'switch' },
        ]
      },
      {
        title: 'Condition',
        fields: [
          { key: 'box_condition', label: 'Box Condition', type: 'select', options: ['Mint', 'Near Mint', 'Good', 'Fair', 'Poor', 'No Box'] },
          { key: 'figure_condition', label: 'Statue Condition', type: 'select', options: ['Mint', 'Near Mint', 'Good', 'Fair', 'Poor'] },
          { key: 'authenticity', label: 'Authenticity Proof', type: 'text', placeholder: 'COA Number, Receipt, etc.' },
        ]
      },
      {
        title: 'Notes',
        fields: [
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ]
      }
    ]
  },
  figure: {
    label: 'Action Figure',
    icon: 'User',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'figure_type', label: 'Figure Type', type: 'select', options: ['Action Figure', 'Soft Vinyl', 'Nendoroid', 'Figma', 'Doll', 'Other'] },
          { key: 'manufacturer', label: 'Manufacturer', type: 'manufacturer', required: true },
          { key: 'license_holder', label: 'License Holder', type: 'text' },
          { key: 'series_name', label: 'Series Name', type: 'text' },
        ]
      },
      {
        title: 'Physical Details',
        fields: [
          { key: 'scale', label: 'Scale', type: 'select', options: ['1/6', '1/12', '3.75 inch', '6 inch', '7 inch', 'Other'] },
          { key: 'material', label: 'Material', type: 'select', options: ['PVC', 'ABS', 'Die-cast', 'Fabric', 'Vinyl', 'Other'] },
          { key: 'articulation_points', label: 'Articulation Points', type: 'number' },
        ]
      },
      {
        title: 'Condition',
        fields: [
          { key: 'box_condition', label: 'Box Condition', type: 'select', options: ['Mint', 'Near Mint', 'Good', 'Fair', 'Poor', 'No Box'] },
          { key: 'figure_condition', label: 'Figure Condition', type: 'select', options: ['Mint', 'Near Mint', 'Good', 'Fair', 'Poor'] },
        ]
      },
      {
        title: 'Provenance & Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
        ]
      },
      {
        title: 'Notes',
        fields: [
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ]
      }
    ]
  },
  hotwheel: {
    label: 'Hot Wheels',
    icon: 'Car',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'name', label: 'Model Name', type: 'text', required: true },
          { key: 'manufacturer', label: 'Manufacturer', type: 'manufacturer', default: 'Mattel' },
          { key: 'series', label: 'Series', type: 'text' },
          { key: 'series_number', label: 'Series Number', type: 'text' },
          { key: 'year', label: 'Year', type: 'number' },
          { key: 'toy_number', label: 'Toy Number', type: 'text' },
        ]
      },
      {
        title: 'Physical Details',
        fields: [
          { key: 'color', label: 'Color', type: 'text' },
          { key: 'tampo', label: 'Tampo', type: 'text' },
          { key: 'wheel_type', label: 'Wheel Type', type: 'text' },
          { key: 'base_type', label: 'Base Type', type: 'text' },
          { key: 'window_color', label: 'Window Color', type: 'text' },
          { key: 'interior_color', label: 'Interior Color', type: 'text' },
        ]
      },
      {
        title: 'Condition',
        fields: [
          { key: 'card_condition', label: 'Card Condition', type: 'select', options: ['Mint', 'Near Mint', 'Good', 'Fair', 'Poor', 'Loose'] },
          { key: 'car_condition', label: 'Car Condition', type: 'select', options: ['Mint', 'Near Mint', 'Good', 'Fair', 'Poor'] },
        ]
      },
      {
        title: 'Provenance & Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
        ]
      },
      {
        title: 'Notes',
        fields: [
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ]
      }
    ]
  },
  lego: {
    label: 'LEGO',
    icon: 'Box',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'name', label: 'Set Name', type: 'text', required: true },
          { key: 'set_number', label: 'Set Number', type: 'text', required: true },
          { key: 'lego_id', label: 'LEGO ID', type: 'text' },
          { key: 'theme', label: 'Theme', type: 'select', options: ['Star Wars', 'Technic', 'City', 'Ninjago', 'Icons', 'Ideas', 'Architecture', 'Other'] },
          { key: 'sub_theme', label: 'Sub-Theme', type: 'text' },
          { key: 'release_year', label: 'Release Year', type: 'number' },
        ]
      },
      {
        title: 'Set Details',
        fields: [
          { key: 'piece_count', label: 'Piece Count', type: 'number' },
          { key: 'minifigures_count', label: 'Minifigures Count', type: 'number' },
          { key: 'minifigure_names', label: 'Minifigure Names', type: 'textarea' },
          { key: 'sticker_sheet_applied', label: 'Sticker Sheet Applied', type: 'switch' },
          { key: 'manual_included', label: 'Manual Included', type: 'switch' },
        ]
      },
      {
        title: 'Condition',
        fields: [
          { key: 'box_condition', label: 'Box Condition', type: 'select', options: ['Mint', 'Near Mint', 'Good', 'Fair', 'Poor', 'No Box'] },
          { key: 'set_condition', label: 'Set Condition', type: 'select', options: ['New Sealed', 'Built', 'Partially Built', 'Disassembled Complete', 'Disassembled Incomplete'] },
        ]
      },
      {
        title: 'Provenance & Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
        ]
      },
      {
        title: 'Notes',
        fields: [
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ]
      }
    ]
  },
  trading_card: {
    label: 'Trading Card',
    icon: 'Layout',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'name', label: 'Card Name', type: 'text', required: true },
          { key: 'card_type', label: 'Card Type', type: 'select', options: ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Sports', 'Other'] },
          { key: 'manufacturer', label: 'Manufacturer', type: 'manufacturer', required: true },
          { key: 'set_name', label: 'Set Name', type: 'text' },
          { key: 'card_number', label: 'Card Number', type: 'text' },
          { key: 'rarity', label: 'Rarity', type: 'select', options: ['Common', 'Uncommon', 'Rare', 'Super Rare', 'Ultra Rare', 'Secret Rare', 'Other'] },
          { key: 'foil', label: 'Foil/Finish', type: 'select', options: ['Non-Foil', 'Foil', 'Reverse Holo', 'Full Art', 'Other'] },
          { key: 'language', label: 'Language', type: 'select', options: ['English', 'Japanese', 'Spanish', 'French', 'German', 'Other'] },
        ]
      },
      {
        title: 'Grading',
        fields: [
          { key: 'graded', label: 'Graded', type: 'switch' },
          { key: 'grading_company', label: 'Grading Company', type: 'select', options: ['PSA', 'BGS', 'CGC', 'SGC', 'Other'], dependsOn: 'graded' },
          { key: 'grade', label: 'Grade', type: 'text', dependsOn: 'graded' },
          { key: 'cert_number', label: 'Certificate Number', type: 'text', dependsOn: 'graded' },
        ]
      },
      {
        title: 'Attributes',
        fields: [
          { key: 'autographed', label: 'Autographed', type: 'switch' },
          { key: 'first_edition', label: 'First Edition', type: 'switch' },
          { key: 'card_condition', label: 'Card Condition', type: 'select', options: ['Mint', 'Near Mint', 'Excellent', 'Lightly Played', 'Moderately Played', 'Heavily Played', 'Damaged'] },
        ]
      },
      {
        title: 'Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
        ]
      }
    ]
  },
  sneakers: {
    label: 'Sneakers',
    icon: 'Footprints',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'brand', label: 'Brand', type: 'manufacturer', required: true },
          { key: 'model', label: 'Model', type: 'text', required: true },
          { key: 'colourway', label: 'Colourway', type: 'text' },
          { key: 'sku', label: 'SKU/Style Code', type: 'text' },
          { key: 'size', label: 'Size', type: 'text' },
          { key: 'release_year', label: 'Release Year', type: 'number' },
          { key: 'collaboration', label: 'Collaboration', type: 'text' },
        ]
      },
      {
        title: 'Condition & Accessories',
        fields: [
          { key: 'condition', label: 'Condition', type: 'select', options: ['DS (Deadstock)', 'VNDS (Very Near Deadstock)', 'Used (Excellent)', 'Used (Good)', 'Used (Fair)'] },
          { key: 'box_included', label: 'Original Box Included', type: 'switch' },
          { key: 'extra_accessories', label: 'Extra Laces/Accessories Included', type: 'switch' },
        ]
      },
      {
        title: 'Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
          { key: 'retail_price', label: 'Retail Price', type: 'number' },
        ]
      }
    ]
  },
  video_game: {
    label: 'Video Game',
    icon: 'Gamepad2',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'name', label: 'Title', type: 'text', required: true },
          { key: 'item_type', label: 'Item Type', type: 'select', options: ['Game Disc/Cartridge', 'Console', 'Accessory', 'Other'] },
          { key: 'platform', label: 'Platform', type: 'select', options: ['PS5', 'PS4', 'PS3', 'PS2', 'PS1', 'Xbox Series', 'Xbox One', 'Xbox 360', 'Nintendo Switch', 'NES', 'SNES', 'N64', 'GameCube', 'Wii', 'GB/GBC/GBA', 'DS/3DS', 'PC', 'Other'] },
          { key: 'region', label: 'Region', type: 'select', options: ['NTSC-U (NA)', 'PAL (EU)', 'NTSC-J (Japan)', 'Region Free'] },
        ]
      },
      {
        title: 'Condition',
        fields: [
          { key: 'condition', label: 'Condition', type: 'select', options: ['Sealed', 'CIB (Complete in Box)', 'Box & Game', 'Loose', 'Other'] },
          { key: 'disc_condition', label: 'Disc/Cartridge Condition', type: 'select', options: ['Mint', 'Near Mint', 'Good', 'Fair', 'Poor'] },
          { key: 'includes_manual', label: 'Includes Manual', type: 'switch' },
          { key: 'includes_inserts', label: 'Includes Inserts', type: 'switch' },
          { key: 'special_edition', label: 'Special Edition', type: 'switch' },
          { key: 'serial_number', label: 'Serial Number', type: 'text' },
        ]
      },
      {
        title: 'Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
        ]
      }
    ]
  },
  watch: {
    label: 'Watch',
    icon: 'Watch',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'brand', label: 'Brand', type: 'manufacturer', required: true },
          { key: 'model', label: 'Model', type: 'text', required: true },
          { key: 'year', label: 'Year', type: 'number' },
          { key: 'movement_type', label: 'Movement', type: 'select', options: ['Automatic', 'Manual Wind', 'Quartz', 'Kinetic', 'Other'] },
        ]
      },
      {
        title: 'Specifications',
        fields: [
          { key: 'case_material', label: 'Case Material', type: 'select', options: ['Stainless Steel', 'Yellow Gold', 'Rose Gold', 'White Gold', 'Platinum', 'Titanium', 'Ceramic', 'Other'] },
          { key: 'bracelet', label: 'Bracelet/Strap', type: 'select', options: ['Oyster', 'Jubilee', 'Leather', 'Rubber', 'NATO', 'Other'] },
          { key: 'water_resistance', label: 'Water Resistance', type: 'text' },
        ]
      },
      {
        title: 'Provenance & Service',
        fields: [
          { key: 'box_included', label: 'Original Box Included', type: 'switch' },
          { key: 'papers_included', label: 'Original Papers Included', type: 'switch' },
          { key: 'serviced', label: 'Serviced', type: 'switch' },
          { key: 'last_service_date', label: 'Last Service Date', type: 'date', dependsOn: 'serviced' },
        ]
      },
      {
        title: 'Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
        ]
      }
    ]
  },
  designer_toy: {
    label: 'Designer Toy',
    icon: 'Ghost',
    sections: [
      {
        title: 'Basic Info',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'artist_studio', label: 'Artist/Studio', type: 'manufacturer', required: true },
          { key: 'series_name', label: 'Series Name', type: 'text' },
          { key: 'year_released', label: 'Year Released', type: 'number' },
        ]
      },
      {
        title: 'Edition & Details',
        fields: [
          { key: 'edition_size', label: 'Edition Size', type: 'number' },
          { key: 'edition_number', label: 'Edition Number', type: 'text' },
          { key: 'material', label: 'Material', type: 'select', options: ['Vinyl', 'ABS', 'Resin', 'Wood', 'Plush', 'Other'] },
          { key: 'height_cm', label: 'Height (cm)', type: 'number' },
          { key: 'signed', label: 'Signed', type: 'switch' },
          { key: 'coa_included', label: 'COA Included', type: 'switch' },
        ]
      },
      {
        title: 'Value',
        fields: [
          { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
          { key: 'cost_price', label: 'Cost Price', type: 'number' },
          { key: 'current_value', label: 'Current Value', type: 'number' },
        ]
      }
    ]
  }
};
