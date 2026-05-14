import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestBasic(unittest.TestCase):
    def test_imports(self):
        try:
            import app
            import ai_engine
            self.assertTrue(True)
        except ImportError as e:
            self.fail(f"Import failed: {e}")

    def test_hash_function(self):
        from ai_engine import compute_sha256
        import tempfile
        
        with tempfile.NamedTemporaryFile(delete=False, mode='w') as f:
            f.write("test content")
            temp_path = f.name
        
        try:
            hash_val = compute_sha256(temp_path)
            self.assertEqual(len(hash_val), 64)
        finally:
            os.unlink(temp_path)

if __name__ == '__main__':
    unittest.main()
