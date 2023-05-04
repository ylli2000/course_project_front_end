      <form id="user-input">
        <div class="form-control">
          <label for="title">Title (needed)</label>
          <input type="text" id="title" />
        </div>
        <div class="form-control">
          <label for="description">Description (max 100 characters)</label>
          <textarea id="description" rows="3" maxlength="100"></textarea>
        </div>
        <div class="form-control">
          <label for="priority">Priority 🔥 (0 - 5)</label>
          <input type="number" id="priority" step="1" min="0" max="5" />
        </div>
        <button type="submit">ADD PROJECT</button>
      </form>